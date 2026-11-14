const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname);
const sandbox={module:{exports:{}},structuredClone};vm.runInNewContext(fs.readFileSync(path.join(root,'editor.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1],sandbox);
const RZL=sandbox.module.exports;
function publish(input){
 const d=RZL.validate(structuredClone(input));
 const currentPath=path.join(root,'protokoll.json');
 if(fs.existsSync(currentPath)){
  const old=JSON.parse(fs.readFileSync(currentPath,'utf8'));
  if(d.revision<=old.revision)throw Error('Die neue Datenversion muss größer sein als die veröffentlichte Version.');
  for(const field of ['entries','sessions','changes'])if(JSON.stringify(d[field].slice(0,old[field].length))!==JSON.stringify(old[field]))throw Error('Vorhandene '+field+' dürfen nicht verändert oder entfernt werden.');
  if(d.created_at!==old.created_at||d.schema_version!==old.schema_version||d.project!==old.project)throw Error('Protokollidentität muss erhalten bleiben.');
 }
 if(d.revision<1)throw Error('Die erste Veröffentlichung beginnt bei Version 001.');
 d.protocol_version=String(d.revision).padStart(3,'0');d.published_at=new Date().toISOString();
 const write=(relative,value,exclusive=false)=>{const target=path.join(root,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(value,null,2)+'\n',exclusive?{flag:'wx'}:undefined);};
 // Archive before changing the current public file. Existing version files are never overwritten.
 write('versionen/protokoll-'+d.protocol_version+'.json',d,true);
 write('protokoll.json',d);
 const head={schema_version:d.schema_version,protocol_version:d.protocol_version,revision:d.revision,published_at:d.published_at};
 write('stand.json',{...head,research_state:d.entries.filter(e=>e.kind==='research_state').at(-1)||null});
 write('nachrichten.json',{...head,messages:d.entries.filter(e=>e.kind==='message').slice(-20)});
 write('entscheidungen.json',{...head,decisions:d.entries.filter(e=>e.kind==='decision')});
 write('sitzungen.json',{...head,sessions:d.sessions});
 for(const s of d.sessions)write('sitzungen/'+s.id+'.json',{...head,session:s,entries:d.entries.filter(e=>e.session_id===s.id)});
 const since=[];
 for(let n=0;n<=d.revision;n++){const file='aenderungen/seit-'+String(n).padStart(3,'0')+'.json';write(file,{...head,from_revision:n,to_revision:d.revision,changes:d.changes.filter(c=>c.revision>n)});since.push({from_revision:n,url:file});}
 write('aenderungen.json',{...head,changes:d.changes,since,versions:fs.readdirSync(path.join(root,'versionen')).filter(n=>/^protokoll-\d+\.json$/.test(n)).sort().map(n=>({url:'versionen/'+n}))});
 return d;
}
if(require.main===module){const input=process.argv[2];if(!input)throw Error('Aufruf: node pages-publication.cjs exportiertes-protokoll.json');const d=publish(JSON.parse(fs.readFileSync(path.resolve(input),'utf8')));console.log('Version '+d.protocol_version+' für manuellen GitHub-Commit vorbereitet.');}
module.exports={publish,RZL,root};
