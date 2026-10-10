(()=>{'use strict';
const $=id=>document.getElementById(id);
const fields=['prefix','master','language','ratio','duration','caption','variant','layout','extension'];
let plan=[],comparison=[],folderPaths=[],folderIgnored=0,hasPlan=false,hasComparison=false,planIsImported=false,demoMode=false,folderSelectionValid=false;
const setError=(id,message)=>{$(id).textContent=message||''};
const count=(id,value)=>{$(id).textContent=value};
const status=(text,kind)=>{const x=$('state');x.textContent=text;x.className='result-state '+(kind||'')};
const parseTokens=(id)=>{
 const raw=$(id).value.trim();
 if(!raw)throw Error('Enter at least one value for '+id+'.');
 const tokens=raw.split(/[,\n]+/).map(v=>v.trim().toLowerCase()).filter(Boolean);
 if(!tokens.length||tokens.length>35)throw Error('Enter 1–35 '+id+' values, separated by commas.');
 if(tokens.some(v=>!/^[a-z0-9][a-z0-9_-]{0,31}$/.test(v)))throw Error(id+': use only letters a–z, numbers, hyphens and underscores (up to 32 characters per value).');
 const unique=[...new Set(tokens)];
 if(unique.length!==tokens.length)throw Error(id+': remove repeated values.');
 return unique;
};
const parseOptionalTokens=id=>$(id).value.trim()?parseTokens(id):[''];
function generate(){
 const prefix=$('prefix').value.trim().toLowerCase();
 if(!/^[a-z0-9][a-z0-9_-]{0,39}$/.test(prefix))throw Error('Project code: use 1–40 ASCII letters, numbers, hyphens or underscores.');
 const values=[parseOptionalTokens('master'),parseTokens('language'),parseTokens('ratio'),parseTokens('duration'),parseOptionalTokens('caption'),parseTokens('variant')];
 const total=values.reduce((n,a)=>n*a.length,1);
 if(total>2500)throw Error('This matrix has '+total.toLocaleString()+' combinations. Use 2,500 or fewer per batch.');
 const layout=$('layout').value,ext=$('extension').value;
 if(!['nested','flat'].includes(layout)||!['mp4','mov','mxf'].includes(ext))throw Error('Unsupported format selection.');
 const next=[];
 for(const master of values[0])for(const lang of values[1])for(const ratio of values[2])for(const duration of values[3])for(const caption of values[4])for(const variant of values[5]){
   const components=[prefix];if(master)components.push(master);components.push(lang,ratio,duration);if(caption)components.push(caption);components.push(variant);
   const filename=components.join('_')+'.'+ext;
   next.push(layout==='nested'?lang+'/'+ratio+'/'+filename:filename);
 }
 if(new Set(next).size!==next.length)throw Error('The naming plan contains a collision.');
 next.sort((a,b)=>a.localeCompare(b,'en'));
 return next;
}
function rowsToTable(records){
 const body=$('report-body');body.replaceChildren();
 if(!records.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=2;td.className='empty';td.textContent='No rows to show.';tr.append(td);body.append(tr);$('table-hint').textContent='';return;}
 const rank={MISSING:0,UNEXPECTED:1,DUPLICATE:2,PRESENT:3,PLANNED:4};
 for(const row of records.slice().sort((a,b)=>(rank[a.status]??9)-(rank[b.status]??9)).slice(0,50)){
  const tr=document.createElement('tr');const td=document.createElement('td'),mark=document.createElement('td'),pill=document.createElement('span');
  td.textContent=row.path;pill.className='pill '+({PLANNED:'pending',PRESENT:'present',MISSING:'missing',UNEXPECTED:'extra',DUPLICATE:'missing'}[row.status]||'pending');
  pill.textContent=row.status;mark.append(pill);tr.append(td,mark);body.append(tr);
 }
 $('table-hint').textContent=records.length>50?'Showing the first 50 of '+records.length.toLocaleString()+' rows, with differences first. Download CSV for the complete list.':'Showing '+records.length.toLocaleString()+' rows.';
}
function renderPlan(){
 demoMode=false;$('download-results').textContent='Download comparison CSV';
 count('expected',plan.length.toLocaleString());count('present','—');count('missing','—');count('extra','—');
 status('PLANNED · NOT VERIFIED','planned');$('report-note').textContent=planIsImported?'Expected video paths imported from your local client naming list. No actual delivery folder has been compared; this is NOT a PASS or evidence of approved video content.':'Expected names generated. No actual delivery folder has been compared; this is not a PASS. File contents and approval have not been checked.';
 rowsToTable(plan.map(path=>({path,status:'PLANNED',detail:'Expected by naming matrix'})));
 $('download-planned').disabled=false;$('download-results').disabled=true;$('compare').disabled=!folderSelectionValid;
}
function resetPlan(note){
 demoMode=false;$('download-results').textContent='Download comparison CSV';
 hasPlan=false;hasComparison=false;planIsImported=false;plan=[];comparison=[];
 count('expected','0');count('present','—');count('missing','—');count('extra','—');status('NOT MEASURED','');
 $('download-planned').disabled=true;$('download-results').disabled=true;$('compare').disabled=true;
 $('report-note').textContent=note||'Generate your naming plan first. A generated manifest is a plan, not a verification.';
 rowsToTable([]);
}
$('matrix-form').addEventListener('submit',e=>{
 e.preventDefault();setError('form-error','');setError('compare-error','');
 try{plan=generate();hasPlan=true;hasComparison=false;planIsImported=false;comparison=[];renderPlan();}
 catch(err){resetPlan('Correct the naming matrix and generate again.');setError('form-error',err.message);}
});
function loadExample90(){
 const example={prefix:'film',master:'hero',language:'en,es,fr',ratio:'16x9,1x1,9x16',duration:'master,60s,30s,15s,6s',caption:'clean,burned',variant:'final',layout:'nested',extension:'mp4'};
 for(const [id,value] of Object.entries(example))$(id).value=value;
 $('matrix-form').requestSubmit();
}
$('load-example-90').addEventListener('click',loadExample90);
function runDemo90(){
 loadExample90();
 if(!hasPlan||plan.length!==90){setError('form-error','The example did not generate 90 filenames.');return}
 // Only fabricated path strings: no local folder, remote services, or video bytes.
 const synthetic=plan.filter((path,i)=>i!==7&&i!==87);
 synthetic.push('en/16x9/film_hero_en_16x9_unrequested_preview.mp4');
 compareWithPaths(synthetic,0,true);
 $('results-title').scrollIntoView({behavior:'smooth',block:'start'});
}
$('run-demo-90').addEventListener('click',runDemo90);
// Explicit ?demo=1 links are demo-only. Never inspect or request local files on page load.
if(new URLSearchParams(location.search).get('demo')==='1')window.addEventListener('load',runDemo90,{once:true});
for(const id of fields){$(id).addEventListener(id==='layout'||id==='extension'?'change':'input',()=>{
 if(hasPlan){resetPlan('The naming settings changed. Generate a new manifest before comparing.');}
 setError('form-error','');setError('compare-error','');
});}
// Client-agreed manifest import is an alternative expected-path source, never a video content check.
function parseManifestCsv(raw){
 const rows=[],row=[];let field='',quoted=false,closed=false;
 const emitField=()=>{row.push(field);field='';closed=false};
 const emitRow=()=>{emitField();if(row.some(x=>x.trim()))rows.push(row.slice());row.length=0};
 for(let i=0;i<raw.length;i++){
  const c=raw[i];
  if(quoted){
   if(c==='"'){if(raw[i+1]==='"'){field+='"';i++}else{quoted=false;closed=true}}
   else field+=c;
  }else if(c==='"'){
   if(field.length||closed)throw Error('Malformed CSV quoting. Use a plain quoted CSV or one-path-per-line TXT.');
   quoted=true;
  }else if(c===','){emitField()}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&raw[i+1]==='\n')i++;emitRow()}
  else{
   if(closed&&c!==' '&&c!=='\t')throw Error('Invalid text after a quoted CSV cell.');
   field+=c;
  }
 }
 if(quoted)throw Error('Unclosed CSV quote.');
 if(row.length||field.length||closed)emitRow();
 return rows;
}
function validRelativeVideoPath(input){
 const path=String(input??'').trim().replace(/\\/g,'/').normalize('NFC');
 if(path.length<5||path.length>512||path.startsWith('/')||/^[a-z]:/i.test(path)||path.includes('//'))throw Error('Use relative video paths, not absolute paths or empty folders.');
 const parts=path.split('/');
 if(parts.some(c=>!c||c==='.'||c==='..'||/[<>:"|?*\x00-\x1f]/.test(c)||/[ .]$/.test(c)))throw Error('Invalid filename segment or path traversal in expected manifest.');
 if(!/\.(mp4|mov|mxf|m4v)$/i.test(path))throw Error('Expected manifest contains a non-video path; only MP4, MOV, MXF or M4V paths are supported.');
 return path;
}
function parseImportedManifest(input,extension){
 const raw=input.replace(/^\uFEFF/,'').trim();
 if(!raw)throw Error('The selected manifest has no filename rows.');
 let names;
 if(extension==='txt')names=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 else{
  const rows=parseManifestCsv(raw);
  if(!rows.length)throw Error('The CSV has no rows.');
  const first=rows[0].map(x=>x.trim().toLowerCase().replace(/[^a-z0-9]/g,''));
  const labels=['relativepath','filename','filepath','videopath','video','file','path','exportfilename','outputfilename','outputpath','videofilename'];
  const pos=first.findIndex(x=>labels.includes(x));
  const start=pos>=0?1:0,idx=pos>=0?pos:0;
  if(pos<0&&rows[0].length>1)throw Error('For multi-column CSVs, label the filename column Relative path, Filename or Path.');
  names=rows.slice(start).filter(x=>x.some(y=>y.trim())).map(x=>x[idx]??'');
 }
 if(!names.length)throw Error('The manifest has no video paths.');
 if(names.length>2500)throw Error('Import 2,500 or fewer expected video paths per batch.');
 const next=names.map(validRelativeVideoPath),keys=new Set();
 for(const entry of next){const k=entry.toLowerCase();if(keys.has(k))throw Error('The manifest repeats a file path (including case-only duplicates): '+entry);keys.add(k)}
 return next.sort((a,b)=>a.localeCompare(b,'en'));
}
$('expected-csv').addEventListener('change',async()=>{
 const input=$('expected-csv'),file=input.files?.[0];setError('csv-error','');
 if(!file){$('csv-state').textContent='No manifest imported. You can use the naming builder above instead.';return}
 if(!/\.(csv|txt)$/i.test(file.name)||file.size>1048576||file.size===0){setError('csv-error','Choose a nonempty .csv or .txt file no larger than 1 MiB.');$('csv-state').textContent='Import rejected; previous plan (if any) remains in place.';return}
 try{
  const content=await file.text(),extension=file.name.split('.').pop().toLowerCase();
  const next=parseImportedManifest(content,extension);
  plan=next;hasPlan=true;hasComparison=false;planIsImported=true;comparison=[];
  renderPlan();
  $('csv-state').textContent=next.length.toLocaleString()+' relative video filenames imported locally from '+file.name+'. The file bytes were not uploaded. Compare with the selected delivery folder below.';
  setError('compare-error','');
 }catch(e){setError('csv-error',e.message);$('csv-state').textContent='Import rejected; previous plan (if any) remains in place.'}
});
$('folder').addEventListener('change',()=>{
 const input=$('folder');folderPaths=[];folderIgnored=0;folderSelectionValid=false;hasComparison=false;comparison=[];
 $('download-results').disabled=true;setError('compare-error','');
 const files=[...input.files];
 if(!files.length){$('folder-state').textContent='No files received from the folder picker. An entirely empty folder cannot be verified by this browser. No comparison performed.';if(hasPlan)renderPlan();return}
 if(files.length>30000){$('folder-state').textContent='Folder has more than 30,000 items. Choose a smaller batch.';if(hasPlan)renderPlan();return}
 folderSelectionValid=true;
 const all=files.map(f=>(f.webkitRelativePath||f.name).replace(/\\/g,'/').normalize('NFC'));
 const first=all[0].split('/')[0];
 const commonRoot=all.every(p=>p.startsWith(first+'/'));
 const stripped=all.map(p=>commonRoot?p.slice(first.length+1):p);
 const isVideo=p=>/\.(mp4|mov|mxf|m4v)$/i.test(p);
 folderPaths=stripped.filter(isVideo);
 folderIgnored=stripped.length-folderPaths.length;
 $('folder-state').textContent=folderPaths.length.toLocaleString()+' video files selected · '+folderIgnored.toLocaleString()+' auxiliary files excluded from this video-only comparison. File bytes were not read.'+(folderPaths.length===0?' No video files found among selected items; run comparison to reveal all expected videos as MISSING.':'');
 if(hasPlan)renderPlan();
});
function compareWithPaths(paths,ignored,synthetic){
 const normalize=p=>p.normalize('NFC').replace(/\\/g,'/').toLowerCase();
 const expectedSet=new Set(plan.map(normalize));
 const actual=new Map(),duplicates=[];
 for(const path of paths){
  const key=normalize(path);
  if(actual.has(key))duplicates.push(path);
  else actual.set(key,path);
 }
 const plannedRows=plan.map(path=>({path,status:actual.has(normalize(path))?'PRESENT':'MISSING',detail:actual.has(normalize(path))?'Expected path found (video bytes not checked)':'Expected path not present'}));
 const unexpected=[...actual].filter(([key])=>!expectedSet.has(key)).map(([,path])=>({path,status:'UNEXPECTED',detail:'Video not listed in expected matrix'}));
 const duplicateRows=duplicates.map(path=>({path,status:'DUPLICATE',detail:'Conflicting case-insensitive relative path'}));
 comparison=[...plannedRows,...unexpected,...duplicateRows];
 if(synthetic)comparison=comparison.map(x=>({...x,detail:'SYNTHETIC DEMO ONLY — no real folder inspected. '+x.detail}));
 const matched=plannedRows.filter(x=>x.status==='PRESENT').length,missing=plan.length-matched,extras=unexpected.length+duplicateRows.length;
 count('expected',plan.length.toLocaleString());count('present',matched.toLocaleString());count('missing',missing.toLocaleString());count('extra',extras.toLocaleString());
 const exact=missing===0&&extras===0;
 if(synthetic){
  status('SYNTHETIC DEMO · NOT FILE QC','planned');
  $('report-note').textContent='SYNTHETIC DEMONSTRATION ONLY: '+missing+' fabricated missing export paths and '+extras+' fabricated extra paths. No real video files or customer folder were selected, uploaded, verified, or approved. Import a real client list and choose your final local folder to run your own inventory check.';
 }else{
  status(exact?'INVENTORY MATCH · NOT FILE QC':'INVENTORY DIFFERENCES',exact?'ok':'bad');
  $('report-note').textContent=exact?
  'All expected video paths were present and no unexpected video paths were found. This is NOT verification of bytes, dimensions, audio, the right version or customer approval. '+ignored+' auxiliary items ignored.':
  missing+' expected video paths missing; '+unexpected.length+' unexpected video paths; '+duplicateRows.length+' case-colliding paths. File content and approval are NOT checked. '+ignored+' auxiliary items ignored.';
 }
 demoMode=!!synthetic;hasComparison=true;$('download-results').disabled=false;
 $('download-results').textContent=synthetic?'Download SYNTHETIC demo CSV':'Download comparison CSV';
 rowsToTable(comparison);
}
$('compare').addEventListener('click',()=>{
 setError('compare-error','');
 if(!hasPlan){setError('compare-error','Generate the expected list first.');return}
 if(!folderSelectionValid){setError('compare-error','Select a final folder with at least one file. An entirely empty folder cannot be inspected by this browser.');return}
 compareWithPaths(folderPaths,folderIgnored,false);
});
function cell(value){
 let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function exportCsv(filename,rows){
 if(!rows.length)return;
 const text='\uFEFF'+[['Relative path','Status','Detail'],...rows.map(x=>[x.path,x.status,x.detail])].map(row=>row.map(cell).join(',')).join('\r\n');
 const blob=new Blob([text],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=filename;a.style.display='none';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),4500);
}
$('download-planned').addEventListener('click',()=>{if(hasPlan)exportCsv('deliveryproof-planned-video-exports.csv',plan.map(path=>({path,status:'PLANNED',detail:planIsImported?'Expected by imported client filename list; video content not approved':'Expected by naming matrix, not verified'})))});
$('download-results').addEventListener('click',()=>{if(hasComparison)exportCsv(demoMode?'deliveryproof-SYNTHETIC-demo-comparison.csv':'deliveryproof-video-inventory-comparison.csv',comparison)});
window.__DeliveryProofMatrixTest={generate,parseTokens,cell,parseManifestCsv,parseImportedManifest,validRelativeVideoPath,normalizeRelative:p=>p.normalize('NFC').replace(/\\/g,'/').toLowerCase()};
})();