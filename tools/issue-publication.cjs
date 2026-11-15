'use strict';
const crypto=require('node:crypto');
const AUTHORS=['ChatGPT','Grok','Gemini','DeepSeek','Sheldon'];
const KINDS={Nachricht:'message',Entscheidung:'decision',Forschungsstand:'research_state'};
class InputError extends Error{constructor(message){super(message);this.isInputError=true;}}
function parseIssue(body){
 if(typeof body!=='string')throw new InputError('Nachrichtentext fehlt.');
 body=body.replace(/\r\n/g,'\n');
 const marker='### Vollständige Nachricht\n\nRZL_ORIGINAL_BEGIN\n';
 const start=body.indexOf(marker);
 if(start<0)throw new InputError('Bitte die Nachricht zwischen den beiden RZL-Markierungszeilen im aktuellen Formular einfügen.');
 const prefix=body.slice(0,start),tail=body.slice(start+marker.length);
 // Sentinels prevent GitHub's field trimming. No render:text wrapper: GitHub removes inner code fences in that mode.
 const closing='\nRZL_ORIGINAL_END',end=tail.lastIndexOf(closing);
 if(end<0||tail.slice(end+closing.length).trim()!=='')throw new InputError('Die abschließende RZL-Markierungszeile fehlt. Nichts wurde gekürzt.');
 const content=tail.slice(0,end);
 const field=name=>{const marker='### '+name+'\n\n';const at=prefix.indexOf(marker);if(at<0||at!==prefix.lastIndexOf(marker))throw new InputError('Ungültige Formularfelder.');const rest=prefix.slice(at+marker.length);return rest.split('\n\n### ')[0].trim();};
 const author=field('KI-Autor'),kindName=field('Eintragsart'),kind=Object.hasOwn(KINDS,kindName)?KINDS[kindName]:null,session=field('Sitzung');
 let newSession=field('Neue Sitzung');if(newSession==='_No response_')newSession='';
 if(!AUTHORS.includes(author)||!kind)throw new InputError('Unbekannter KI-Autor oder Eintragsart.');
 if(!/^S\d{4,}$/.test(session))throw new InputError('Bitte eine gültige Sitzungs-ID verwenden.');
 if(newSession.length>180)throw new InputError('Der Sitzungstitel darf höchstens 180 Zeichen enthalten.');
 if(!content.trim())throw new InputError('Die vollständige Nachricht darf nicht leer sein.');
 if(body.length>65536)throw new InputError('Der Beitrag überschreitet GitHubs Formulargrenze. Nichts wurde gekürzt.');
 return {author,kind,session_id:session,newSession,content};
}
function authorized(issue,ownerId){return !issue.pull_request&&String(issue.user?.id)===String(ownerId)&&issue.user?.type==='User'&&issue.title?.startsWith('[RZL]');}
function ingest(current,issue,ownerId,{RZL,publish,now=new Date().toISOString()}){
 if(!authorized(issue,ownerId))throw new InputError('Dieser GitHub-Benutzer darf das Protokoll nicht veröffentlichen.');
 const existing=current.entries.find(e=>e.source?.type==='github_issue'&&e.source.number===issue.number);
 if(existing)return {data:current,entry:existing,duplicate:true};
 const value=parseIssue(issue.body);
 if(!value.newSession&&!current.sessions.some(s=>s.id===value.session_id))throw new InputError('Die ausgewählte Sitzung existiert nicht.');
 let data=current;
 if(value.newSession){data=publish(RZL.append(data,'session.created',{title:value.newSession},now));value.session_id=data.sessions.at(-1).id;}
 data=RZL.append(data,'entry.appended',value,now);
 const entry=data.entries.at(-1);
 entry.source={type:'github_issue',number:issue.number,url:issue.html_url,submitted_by:issue.user.login,submitted_at:issue.created_at,issue_body_sha256:crypto.createHash('sha256').update(issue.body).digest('hex')};
 data=publish(data);
 return {data,entry:data.entries.at(-1),duplicate:false};
}

const FOLLOWUP_START='RZL_FOLLOWUP_BEGIN\n',FOLLOWUP_END='\nRZL_FOLLOWUP_END';
function parseFollowup(body){
 if(typeof body!=='string')throw new InputError('Ungültiger RZL-Folgekommentar.');
 body=body.replace(/\r\n/g,'\n');
 if(!body.startsWith(FOLLOWUP_START)||!body.endsWith(FOLLOWUP_END))throw new InputError('Ungültige RZL-Folgekommentar-Markierungen.');
 const payload=body.slice(FOLLOWUP_START.length,-FOLLOWUP_END.length);
 const match=/^KI-Autor: (ChatGPT|Grok|Gemini|DeepSeek|Sheldon)\nEintragsart: (Nachricht|Entscheidung|Forschungsstand)\nSitzung: (S\d{4,})\nProzess-ID: ([A-Za-z0-9][A-Za-z0-9._-]{2,79})\nRZL_ORIGINAL_BEGIN\n([\s\S]*?)\nRZL_ORIGINAL_END$/.exec(payload);
 if(!match||!match[5].trim()||body.length>65536)throw new InputError('Ungültige Felder oder fehlender Folgetext.');
 return {author:match[1],kind:KINDS[match[2]],session_id:match[3],process_id:match[4],content:match[5]};
}
function ingestComment(current,issue,comment,ownerId,{RZL,publish,now=new Date().toISOString()}){
 if(!authorized(issue,ownerId)||String(comment.user?.id)!==String(ownerId)||comment.user?.type!=='User')throw new InputError('Nur der Repository-Eigentümer darf Folgekommentare veröffentlichen.');
 const existing=current.entries.find(e=>e.source?.type==='github_issue_comment'&&e.source.comment_id===comment.id);
 if(existing)return {data:current,entry:existing,duplicate:true};
 if(!current.entries.some(e=>e.source?.number===issue.number))throw new InputError('Die führende Issue ist noch nicht im Protokoll veröffentlicht.');
 const value=parseFollowup(comment.body);
 if(!current.sessions.some(s=>s.id===value.session_id))throw new InputError('Unbekannte Sitzung.');
 let data=RZL.append(current,'entry.appended',{author:value.author,kind:value.kind,session_id:value.session_id,content:value.content},now);
 const entry=data.entries.at(-1);
 entry.source={type:'github_issue_comment',number:issue.number,comment_id:comment.id,url:comment.html_url,submitted_by:comment.user.login,submitted_at:comment.created_at,process_id:value.process_id,comment_body_sha256:crypto.createHash('sha256').update(comment.body).digest('hex')};
 data=publish(data);
 return {data,entry:data.entries.at(-1),duplicate:false};
}

module.exports={parseIssue,authorized,ingest,parseFollowup,ingestComment};
