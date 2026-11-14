'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {publish,buildViews,RZL,root}=require('../aktualisieren.cjs');
const {authorized,ingest}=require('./issue-publication.cjs');
const REPO='rebootzombie/rzl-ki-protokoll',BASE='https://rebootzombie.github.io/rzl-ki-protokoll/';
if(process.env.GITHUB_REPOSITORY!==REPO)throw Error('Dieses Programm ist auf das RZL-Protokoll-Repository beschränkt.');
const token=process.env.GH_TOKEN;if(!token)throw Error('Kurzlebiges Workflow-Token fehlt.');
async function api(route,method='GET',body){const r=await fetch('https://api.github.com/repos/'+REPO+route,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw Error('GitHub API '+method+' '+route+': HTTP '+r.status);return r.status===204?null:r.json();}
async function commentsOnce(number,body){const comments=await api('/issues/'+number+'/comments?per_page=100');if(!comments.some(c=>c.user?.type==='Bot'&&c.body===body))await api('/issues/'+number+'/comments','POST',{body});}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function main(){
 if(process.argv[2]==='confirm'){
  const state=JSON.parse(fs.readFileSync('.publication-state.json','utf8'));if(!state.accepted.length)return;
  let live;
  for(let attempt=0;attempt<18;attempt++){const r=await fetch(BASE+'protokoll.json',{cache:'no-store'});if(r.ok){live=await r.json();if(live.revision>=state.revision&&state.accepted.every(a=>live.entries.some(e=>e.id===a.id&&e.source?.number===a.number)))break;}if(attempt<17)await delay(10000);}
  if(!live||live.revision<state.revision||!state.accepted.every(a=>live.entries.some(e=>e.id===a.id&&e.source?.number===a.number)))throw Error('Pages wurde ausgeliefert, aber die neue Version ist am öffentlichen JSON noch nicht bestätigt. Workflow erneut starten.');
  for(const accepted of state.accepted){await commentsOnce(accepted.number,'RZL: Veröffentlicht als **'+accepted.id+'** in Protokollversion **'+String(accepted.revision).padStart(3,'0')+'**.\n\n[Beitrag im Forschungsprotokoll]('+BASE+'#'+accepted.id+') · [Maschinenlesbarer Beitrag]('+BASE+'nachrichten/'+accepted.id+'.json)\n\nDie öffentliche JSON-Auslieferung wurde geprüft.');await api('/issues/'+accepted.number,'PATCH',{state:'closed',state_reason:'completed'});}
  console.log('Öffentliche Auslieferung bestätigt; '+state.accepted.length+' Eingaben abgeschlossen.');return;
 }
 const repo=await api('');const head=await api('/git/ref/heads/main');
 const local=cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();if(local!==head.object.sha)throw Error('main wurde inzwischen geändert. Workflow erneut starten.');
 let current=RZL.validate(JSON.parse(fs.readFileSync(path.join(root,'protokoll.json'),'utf8'))),changed=false;
 const state={accepted:[],rejected:[],revision:current.revision};
 for(let page=1;;page++){
  const issues=await api('/issues?state=open&sort=created&direction=asc&per_page=100&page='+page);
  for(const issue of issues){if(!authorized(issue,repo.owner.id))continue;
   try{const result=ingest(current,issue,repo.owner.id,{RZL,publish});current=result.data;changed=changed||!result.duplicate;state.accepted.push({number:issue.number,id:result.entry.id,revision:result.entry.revision});}
   catch(error){state.rejected.push({number:issue.number,error:error.message});await commentsOnce(issue.number,'RZL: Nicht veröffentlicht. '+error.message+' Bitte die Eingabe berichtigen und erneut öffnen.');}
  }
  if(issues.length<100)break;
 }
 buildViews(current);
 if(changed){
  const oldCommit=await api('/git/commits/'+head.object.sha);
  const files=[];
  function walk(dir){for(const item of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=path.posix.join(dir,item.name);if(item.isDirectory()&&['aenderungen','versionen','sitzungen','nachrichten'].includes(rel))walk(rel);else if(item.isFile()&&rel.endsWith('.json'))files.push({path:rel,mode:'100644',type:'blob',content:fs.readFileSync(path.join(root,rel),'utf8')});}}
  walk('');
  const tree=await api('/git/trees','POST',{base_tree:oldCommit.tree.sha,tree:files});
  const commit=await api('/git/commits','POST',{message:'Protokoll '+current.protocol_version+': GitHub-Formular '+state.accepted.map(a=>'#'+a.number).join(', '),tree:tree.sha,parents:[head.object.sha]});
  await api('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});
  console.log('Version '+current.protocol_version+' in Git versioniert.');
 }
 state.revision=current.revision;fs.writeFileSync('.publication-state.json',JSON.stringify(state));
 const publicDir=path.join(root,'.public');fs.mkdirSync(publicDir,{recursive:true});
 for(const item of fs.readdirSync(root,{withFileTypes:true})){if(['.git','.github','.public','tools','tests','node_modules'].includes(item.name)||item.name.startsWith('.publication-'))continue;if(item.isDirectory()&&!['aenderungen','versionen','sitzungen','nachrichten'].includes(item.name))continue;if(item.isFile()&&!/\.(html|json|cjs|md|txt)$/.test(item.name)&&!['.nojekyll','_headers'].includes(item.name))continue;fs.cpSync(path.join(root,item.name),path.join(publicDir,item.name),{recursive:true});}
 console.log('Pages-Artefakt vorbereitet. Akzeptiert: '+state.accepted.length+', abgelehnt: '+state.rejected.length+'.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
