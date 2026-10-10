(()=>{'use strict';
const $=id=>document.getElementById(id);
const fields=['prefix','language','ratio','duration','variant','layout','extension'];
let plan=[],comparison=[],folderPaths=[],folderIgnored=0,hasPlan=false,hasComparison=false;
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
function generate(){
 const prefix=$('prefix').value.trim().toLowerCase();
 if(!/^[a-z0-9][a-z0-9_-]{0,39}$/.test(prefix))throw Error('Project code: use 1–40 ASCII letters, numbers, hyphens or underscores.');
 const values=[parseTokens('language'),parseTokens('ratio'),parseTokens('duration'),parseTokens('variant')];
 const total=values.reduce((n,a)=>n*a.length,1);
 if(total>2500)throw Error('This matrix has '+total.toLocaleString()+' combinations. Use 2,500 or fewer per batch.');
 const layout=$('layout').value,ext=$('extension').value;
 if(!['nested','flat'].includes(layout)||!['mp4','mov','mxf'].includes(ext))throw Error('Unsupported format selection.');
 const next=[];
 for(const lang of values[0])for(const ratio of values[1])for(const duration of values[2])for(const variant of values[3]){
   const filename=prefix+'_'+lang+'_'+ratio+'_'+duration+'_'+variant+'.'+ext;
   next.push(layout==='nested'?lang+'/'+ratio+'/'+filename:filename);
 }
 if(new Set(next).size!==next.length)throw Error('The naming plan contains a collision.');
 next.sort((a,b)=>a.localeCompare(b,'en'));
 return next;
}
function rowsToTable(records){
 const body=$('report-body');body.replaceChildren();
 if(!records.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=2;td.className='empty';td.textContent='No rows to show.';tr.append(td);body.append(tr);$('table-hint').textContent='';return;}
 for(const row of records.slice(0,50)){
  const tr=document.createElement('tr');const td=document.createElement('td'),mark=document.createElement('td'),pill=document.createElement('span');
  td.textContent=row.path;pill.className='pill '+({PLANNED:'pending',PRESENT:'present',MISSING:'missing',UNEXPECTED:'extra',DUPLICATE:'missing'}[row.status]||'pending');
  pill.textContent=row.status;mark.append(pill);tr.append(td,mark);body.append(tr);
 }
 $('table-hint').textContent=records.length>50?'Showing the first 50 of '+records.length.toLocaleString()+' rows. Download CSV for the complete list.':'Showing '+records.length.toLocaleString()+' rows.';
}
function renderPlan(){
 count('expected',plan.length.toLocaleString());count('present','—');count('missing','—');count('extra','—');
 status('PLANNED · NOT VERIFIED','planned');$('report-note').textContent='Expected names generated. No actual delivery folder has been compared; this is not a PASS. File contents and approval have not been checked.';
 rowsToTable(plan.map(path=>({path,status:'PLANNED',detail:'Expected by naming matrix'})));
 $('download-planned').disabled=false;$('download-results').disabled=true;$('compare').disabled=!folderPaths.length;
}
function resetPlan(note){
 hasPlan=false;hasComparison=false;plan=[];comparison=[];
 count('expected','0');count('present','—');count('missing','—');count('extra','—');status('NOT MEASURED','');
 $('download-planned').disabled=true;$('download-results').disabled=true;$('compare').disabled=true;
 $('report-note').textContent=note||'Generate your naming plan first. A generated manifest is a plan, not a verification.';
 rowsToTable([]);
}
$('matrix-form').addEventListener('submit',e=>{
 e.preventDefault();setError('form-error','');setError('compare-error','');
 try{plan=generate();hasPlan=true;hasComparison=false;comparison=[];renderPlan();}
 catch(err){resetPlan('Correct the naming matrix and generate again.');setError('form-error',err.message);}
});
for(const id of fields){$(id).addEventListener(id==='layout'||id==='extension'?'change':'input',()=>{
 if(hasPlan){resetPlan('The naming settings changed. Generate a new manifest before comparing.');}
 setError('form-error','');setError('compare-error','');
});}
$('folder').addEventListener('change',()=>{
 const input=$('folder');folderPaths=[];folderIgnored=0;hasComparison=false;comparison=[];
 $('download-results').disabled=true;setError('compare-error','');
 const files=[...input.files];
 if(!files.length){$('folder-state').textContent='No folder selected — no comparison performed';if(hasPlan)renderPlan();return}
 if(files.length>30000){$('folder-state').textContent='Folder has more than 30,000 items. Choose a smaller batch.';if(hasPlan)renderPlan();return}
 const all=files.map(f=>(f.webkitRelativePath||f.name).replace(/\\/g,'/').normalize('NFC'));
 const first=all[0].split('/')[0];
 const commonRoot=all.every(p=>p.startsWith(first+'/'));
 const stripped=all.map(p=>commonRoot?p.slice(first.length+1):p);
 const isVideo=p=>/\.(mp4|mov|mxf|m4v)$/i.test(p);
 folderPaths=stripped.filter(isVideo);
 folderIgnored=stripped.length-folderPaths.length;
 $('folder-state').textContent=folderPaths.length.toLocaleString()+' video files selected · '+folderIgnored.toLocaleString()+' auxiliary files excluded from this video-only comparison. File bytes were not read.';
 if(hasPlan)renderPlan();
});
$('compare').addEventListener('click',()=>{
 setError('compare-error','');
 if(!hasPlan){setError('compare-error','Generate the expected list first.');return}
 if(!folderPaths.length){setError('compare-error','Select a folder containing video files.');return}
 const normalize=p=>p.normalize('NFC').replace(/\\/g,'/').toLowerCase();
 const expectedSet=new Set(plan.map(normalize));
 const actual=new Map(),duplicates=[];
 for(const path of folderPaths){
  const key=normalize(path);
  if(actual.has(key))duplicates.push(path);
  else actual.set(key,path);
 }
 const plannedRows=plan.map(path=>({path,status:actual.has(normalize(path))?'PRESENT':'MISSING',detail:actual.has(normalize(path))?'Expected path found (content not checked)':'Expected path not present'}));
 const unexpected=[...actual].filter(([key])=>!expectedSet.has(key)).map(([,path])=>({path,status:'UNEXPECTED',detail:'Video not listed in expected matrix'}));
 const duplicateRows=duplicates.map(path=>({path,status:'DUPLICATE',detail:'Conflicting case-insensitive relative path'}));
 comparison=[...plannedRows,...unexpected,...duplicateRows];
 const matched=plannedRows.filter(x=>x.status==='PRESENT').length,missing=plan.length-matched;
 count('expected',plan.length.toLocaleString());count('present',matched.toLocaleString());count('missing',missing.toLocaleString());count('extra',(unexpected.length+duplicateRows.length).toLocaleString());
 const exact=missing===0&&unexpected.length===0&&duplicates.length===0;
 status(exact?'INVENTORY MATCH · NOT FILE QC':'INVENTORY DIFFERENCES',exact?'ok':'bad');
 $('report-note').textContent=exact?
 'All expected video paths were present and no unexpected video paths were found. This is NOT verification of bytes, dimensions, audio, the right version or customer approval. '+folderIgnored+' auxiliary items ignored.':
 missing+' expected video paths missing; '+unexpected.length+' unexpected video paths; '+duplicateRows.length+' case-colliding paths. File content and approval are NOT checked. '+folderIgnored+' auxiliary items ignored.';
 hasComparison=true;$('download-results').disabled=false;rowsToTable(comparison);
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
$('download-planned').addEventListener('click',()=>{if(hasPlan)exportCsv('deliveryproof-planned-video-exports.csv',plan.map(path=>({path,status:'PLANNED',detail:'Expected by naming matrix, not verified'})))});
$('download-results').addEventListener('click',()=>{if(hasComparison)exportCsv('deliveryproof-video-inventory-comparison.csv',comparison)});
window.__DeliveryProofMatrixTest={generate,parseTokens,cell,normalizeRelative:p=>p.normalize('NFC').replace(/\\/g,'/').toLowerCase()};
})();