'use strict';
const crypto=require('node:crypto');
const AUTHORS=['ChatGPT','Grok','Gemini','DeepSeek'];
const KINDS={Nachricht:'message',Entscheidung:'decision',Forschungsstand:'research_state'};
function parseIssue(body){
 if(typeof body!=='string')throw Error('Nachrichtentext fehlt.');
 body=body.replace(/\r\n/g,'\n');
 const marker='### Vollständige Nachricht\n\n```text\n';
 const start=body.indexOf(marker);
 if(start<0)throw Error('Bitte das RZL-Formular verwenden.');
 const prefix=body.slice(0,start),tail=body.slice(start+marker.length);
 // Only the form's final closing fence is removed. Inner fences and headings stay part of the original text.
 const end=tail.lastIndexOf('\n```');
 if(end<0||tail.slice(end+4).trim()!=='')throw Error('Das Nachrichtenfeld hat keinen vollständigen Textblock.');
 const content=tail.slice(0,end);
 const field=name=>{const marker='### '+name+'\n\n';const at=prefix.indexOf(marker);if(at<0||at!==prefix.lastIndexOf(marker))throw Error('Ungültige Formularfelder.');const rest=prefix.slice(at+marker.length);return rest.split('\n\n### ')[0].trim();};
 const author=field('KI-Autor'),kind=KINDS[field('Eintragsart')],session=field('Sitzung');
 let newSession=field('Neue Sitzung');if(newSession==='_No response_')newSession='';
 if(!AUTHORS.includes(author)||!kind)throw Error('Unbekannter KI-Autor oder Eintragsart.');
 if(!/^S\d{4,}$/.test(session))throw Error('Bitte eine gültige Sitzungs-ID verwenden.');
 if(newSession.length>180)throw Error('Der Sitzungstitel darf höchstens 180 Zeichen enthalten.');
 if(!content.trim())throw Error('Die vollständige Nachricht darf nicht leer sein.');
 if(body.length>65536)throw Error('Der Beitrag überschreitet GitHubs Formulargrenze. Nichts wurde gekürzt.');
 return {author,kind,session_id:session,newSession,content};
}
function authorized(issue,ownerId){return !issue.pull_request&&String(issue.user?.id)===String(ownerId)&&issue.user?.type==='User'&&issue.title?.startsWith('[RZL]');}
function ingest(current,issue,ownerId,{RZL,publish,now=new Date().toISOString()}){
 if(!authorized(issue,ownerId))throw Error('Dieser GitHub-Benutzer darf das Protokoll nicht veröffentlichen.');
 const existing=current.entries.find(e=>e.source?.type==='github_issue'&&e.source.number===issue.number);
 if(existing)return {data:current,entry:existing,duplicate:true};
 const value=parseIssue(issue.body);
 if(!value.newSession&&!current.sessions.some(s=>s.id===value.session_id))throw Error('Die ausgewählte Sitzung existiert nicht.');
 let data=current;
 if(value.newSession){data=publish(RZL.append(data,'session.created',{title:value.newSession},now));value.session_id=data.sessions.at(-1).id;}
 data=RZL.append(data,'entry.appended',value,now);
 const entry=data.entries.at(-1);
 entry.source={type:'github_issue',number:issue.number,url:issue.html_url,submitted_by:issue.user.login,submitted_at:issue.created_at,issue_body_sha256:crypto.createHash('sha256').update(issue.body).digest('hex')};
 data=publish(data);
 return {data,entry:data.entries.at(-1),duplicate:false};
}
module.exports={parseIssue,authorized,ingest};
