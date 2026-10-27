(function(){
'use strict';
const byId=id=>document.getElementById(id);
const api=window.WorkflowPackCore;
const demoCsv=[['거래일','거래처코드','거래처','상품코드','상품명','수량','단가'],['2026-10-21','001','가상상사','0007','샘플상품',2,10000],['2026-10-22','001','가상상사','0007','샘플상품',3,5000],['2026-10-22','002','샘플마트','0008','체험상품',4,5000],['2026-02-30','002','샘플마트','0008','체험상품',1,2000],['2026-10-23','001','가상상사','0007','샘플상품','',10000]].map(row=>row.join(',')).join('\r\n')+'\r\n';
let encoding='auto',files=[],last=null,lastIsDemo=false;
const fmt=n=>Number(n||0).toLocaleString('ko-KR');
function announce(msg){byId('live-announcement').textContent=msg;}
function status(txt,cls){let x=byId('task-status');x.textContent=txt;x.className='status-chip'+(cls?' '+cls:'');}
function setFiles(input){
 files=[...input];last=null;lastIsDemo=false;byId('results').classList.add('hidden');byId('input-error').classList.add('hidden');
 const host=byId('file-list');host.replaceChildren();
 if(!files.length){const p=document.createElement('p');p.className='empty-files';p.textContent='선택한 파일이 없습니다.';host.append(p);}
 for(const f of files){const p=document.createElement('div');p.className='file-pill';const n=document.createElement('strong');n.textContent=f.name;const s=document.createElement('span');s.textContent=(f.size/1024).toFixed(1)+' KB';p.append(n,s);host.append(p);}
 byId('run-button').disabled=files.length===0;status(files.length?files.length+'개 선택':'대기 중');
}
function decode(buffer){
 if(encoding==='auto'){
  try{return new TextDecoder('utf-8',{fatal:true}).decode(buffer);}catch(e){return new TextDecoder('euc-kr',{fatal:true}).decode(buffer);}
 }
 return new TextDecoder(encoding,{fatal:true}).decode(buffer);
}
async function inspect(){
 if(!files.length)return;
 byId('input-error').classList.add('hidden');
 const b=byId('run-button');b.disabled=true;b.querySelector('span').textContent='검수 진행 중…';status('검수 중');
 try{
  if(files.length>api.MAX_FILES)throw Error('한 번에 CSV '+api.MAX_FILES+'개까지 선택해 주세요.');
  const total=files.reduce((sum,f)=>sum+f.size,0);
  if(total>api.MAX_TOTAL_BYTES)throw Error('전체 파일이 20MB를 초과합니다.');
  let input=[];
  for(const f of files){
   if(!/\.csv$/i.test(f.name))throw Error('CSV 확장자가 아닙니다: '+f.name);
   if(f.size>api.MAX_FILE_BYTES)throw Error('파일당 10MB 초과: '+f.name);
   let txt;
   try{txt=decode(await f.arrayBuffer());}catch(e){throw Error('인코딩 판독 실패: '+f.name+'. UTF-8 또는 CP949인지 확인해 주세요.');}
   input.push({name:f.name,text:txt,bytes:f.size});
  }
  const result=api.processFiles(input);render(result,false);
 }catch(e){
  const msg=String(e.message||'파일 검수 중 문제가 발생했습니다.');
  let tip='파일이 CSV 형식인지와 첫 줄의 필수 열 7개를 확인해 주세요.';
  if(/파일.*5개|최대 5개/.test(msg))tip='한 번에 파일을 5개 이하로 선택해 주세요.';
  else if(/10MB|20MB|10,000행|10000행/.test(msg))tip='파일 개수·크기·행 수가 사용 한도를 넘었는지 확인하고 파일을 나눠 다시 실행해 주세요.';
  else if(/인코딩|NUL/.test(msg))tip='엑셀에서 CSV UTF-8로 다시 저장하거나 파일 인코딩을 CP949로 변경해 보세요.';
  else if(/\.csv|확장자/.test(msg))tip='엑셀(.xlsx) 파일은 열 수 없습니다. 엑셀에서 CSV UTF-8(.csv)로 저장한 파일을 선택하세요.';
  else if(/따옴표|CSV가 아닙니다/.test(msg))tip='CSV 표 안의 쉼표와 따옴표를 확인하고 파일을 CSV UTF-8 형식으로 다시 저장해 주세요.';
  byId('input-error-message').textContent=msg+' '+tip;
  byId('input-error').classList.remove('hidden');
  status('확인 필요','error');announce(msg);window.alert(msg+'\n\n'+tip);
 }
 finally{b.querySelector('span').textContent='CSV 검수 실행';b.disabled=files.length===0;}
}
function render(result,demo){
 last=result;lastIsDemo=demo;
 const stats=result.stats||{};
 byId('results').classList.remove('hidden');
 byId('metric-all').textContent=fmt(stats.totalRows);byId('metric-ok').textContent=fmt(stats.includedRows);
 byId('metric-errors').textContent=fmt(stats.excludedRows);byId('metric-amount').textContent='₩'+fmt(stats.totalAmount);
 const partial=stats.partial||stats.fileErrors||stats.excludedRows>0;
 byId('partial-label').textContent=partial?'오류·제외행을 뺀 부분 합계':'기본 검증 행의 합계';
 const tbody=byId('summary-body');tbody.replaceChildren();
 if(!result.summary.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.className='table-empty';td.textContent='집계에 포함된 정상 거래가 없습니다.';tr.append(td);tbody.append(tr);}
 for(const row of result.summary.slice(0,60)){
  const tr=document.createElement('tr');
  for(const [key,numeric] of [['거래처',false],['상품명',false],['총수량',true],['총금액',true]]){
   const td=document.createElement('td');td.textContent=numeric?fmt(row[key]):row[key];tr.append(td);
  }
  tbody.append(tr);
 }
 const errors=byId('error-items');errors.replaceChildren();
 if(result.errors.length){for(const err of result.errors.slice(0,12)){
  const item=document.createElement('div');item.className='error-item';
  const strong=document.createElement('b');strong.textContent=err.reason;
  const detail=document.createElement('span');detail.textContent=err.file+' · 원본 '+err.line+'행';
  item.append(strong,detail);errors.append(item);
 }
 if(result.errors.length>12){const p=document.createElement('p');p.className='empty-files';p.textContent='나머지 '+fmt(result.errors.length-12)+'건은 오류 CSV에서 확인하세요.';errors.append(p);}
 }else{const p=document.createElement('div');p.className='no-error';p.textContent='기본 구조 오류가 발견되지 않았습니다. 실제 거래의 진위는 별도 검토해야 합니다.';errors.append(p);}
 byId('result-subtitle').textContent=demo?'가상 데이터 예시입니다. 실제 고객 거래가 아닙니다.':fmt(stats.fileCount)+'개 파일의 거래값을 점검했습니다.';
 byId('result-status').textContent=partial?'일부 제외 · 확인 필요':'기본 검수 완료';
 byId('result-status').className='status-chip '+(partial?'error':'completed');
 status(demo?'체험 완료':'검수 완료','completed');
 byId('result-warning').textContent=(demo?'가상 데이터로 작성한 체험 화면입니다. 실거래가 아닙니다. ':'')+(partial?'제외된 행이 있어 정상행 합계는 모든 거래의 확정 매출이 아닙니다. ':'')+'취소·환불·세금 규칙과 거래의 실제 진위는 별도 확인이 필요합니다.';
 announce('정상 '+fmt(stats.includedRows)+'행, 오류 '+fmt(stats.excludedRows)+'행 검수 완료');
 byId('results').scrollIntoView({behavior:'smooth',block:'start'});
}
function toBase64(content){
 const bytes=new TextEncoder().encode(content);let binary='';
 for(let pos=0;pos<bytes.length;pos+=8192){binary+=String.fromCharCode(...bytes.subarray(pos,pos+8192));}
 return btoa(binary);
}
function saveText(name,content,mime){
 if(window.WFPAndroid&&typeof window.WFPAndroid.saveCsv==='function'){
  window.WFPAndroid.saveCsv(name,toBase64(content),mime);return;
 }
 if(window.WFPToss&&typeof window.WFPToss.saveCsv==='function'){
  Promise.resolve().then(()=>window.WFPToss.saveCsv(name,toBase64(content),mime))
    .then(()=>announce(name+' 저장이 완료되었습니다.'))
    .catch(()=>{announce('CSV 저장을 완료하지 못했습니다.');window.alert('파일을 저장하지 못했습니다. 토스 앱을 업데이트한 뒤 다시 시도해 주세요.');});
  return;
 }
 const url=URL.createObjectURL(new Blob([content],{type:mime}));
 const a=document.createElement('a');a.download=name;a.href=url;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function saveResult(kind,name){if(!last)return;saveText(name,'\ufeff'+api.exportCSV(last,kind),'text/csv;charset=utf-8');}
// Allow paste directly from Excel: clipboard TSV → existing local CSV engine.
// Never send spreadsheet text over the network or retain it in web storage.
byId('paste-run').addEventListener('click',async()=>{
 const box=byId('excel-paste');
 const value=box.value.replace(/^\uFEFF/,'');
 const failure=(message)=>{
  byId('input-error-message').textContent=message;
  byId('input-error').classList.remove('hidden');
  status('확인 필요','error');announce(message);
 };
 try{
  if(!value.trim())throw Error('엑셀에서 제목 행을 포함한 표를 복사한 뒤 붙여넣어 주세요.');
  const sourceBytes=new TextEncoder().encode(value).byteLength;
  if(sourceBytes>api.MAX_FILE_BYTES)throw Error('붙여넣기 최대 크기는 10MB입니다. 표를 나눠서 검사해 주세요.');
  const isTsv=value.includes('\t');
  const rows=isTsv?api.parseTSV(value):api.parseCSV(value);
  if(rows.length<2)throw Error('제목 행과 거래 데이터가 최소 1행 이상 필요합니다.');
  const keys=rows[0].cells.map(x=>x.trim());
  const missing=api.HEADERS.filter(x=>!keys.includes(x));
  if(missing.length)throw Error('첫 줄에 필요한 열이 없습니다: '+missing.join(', ')+'. 제공된 엑셀 표의 열 이름을 확인해 주세요.');
  const csv=api.toCSV(rows[0].cells,rows.slice(1).map(row=>row.cells));
  const staged=new File([csv],'엑셀_표_붙여넣기.csv',{type:'text/csv;charset=utf-8'});
  if(staged.size>api.MAX_FILE_BYTES)throw Error('변환된 데이터가 10MB를 초과합니다. 일부 행씩 검사해 주세요.');
  box.value='';
  setFiles([staged]);
  await inspect();
 }catch(e){failure(String(e.message||e));}
});
byId('csv-files').addEventListener('change',e=>setFiles(e.target.files||[]));
const zone=byId('dropzone');
zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag');});
zone.addEventListener('dragleave',()=>zone.classList.remove('drag'));
zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag');setFiles(e.dataTransfer.files||[]);});
for(const b of document.querySelectorAll('.encoding'))b.addEventListener('click',()=>{
 encoding=b.dataset.encoding;
 for(const other of document.querySelectorAll('.encoding')){let selected=other===b;other.classList.toggle('active',selected);other.setAttribute('aria-pressed',selected?'true':'false');}
});
byId('run-button').addEventListener('click',inspect);
byId('guide-demo').addEventListener('click',()=>byId('demo-button').click());
byId('demo-button').addEventListener('click',()=>{
 try{const r=api.processFiles([{name:'가상거래_체험.csv',text:demoCsv,bytes:new TextEncoder().encode(demoCsv).length}]);render(r,true);}
 catch(e){announce(e.message);window.alert(e.message);}
});
byId('sample-download').addEventListener('click',()=>{saveText('WORKFLOW_PACK_가상거래_5행.csv','\ufeff'+demoCsv,'text/csv;charset=utf-8');announce('가상 CSV 샘플을 저장했습니다.');});
byId('save-normal').addEventListener('click',()=>saveResult('normalized','WORKFLOW_PACK_정상거래.csv'));
byId('save-summary').addEventListener('click',()=>saveResult('summary','WORKFLOW_PACK_거래처상품집계.csv'));
byId('save-errors').addEventListener('click',()=>saveResult('errors','WORKFLOW_PACK_오류제외.csv'));
byId('share-checker').addEventListener('click',async()=>{
 const publicUrl='https://dlaepdfuf89-crypto.github.io/workflow-pack/excel-paste-checker.html';
 const title='엑셀 거래내역 무료 오류검사 | WORKFLOW PACK';
 const description='엑셀 표를 복사해 붙여넣으면 날짜·수량·단가 오류와 거래처별 집계를 무료로 확인할 수 있어요.';
 try{
  if(typeof navigator.share==='function')await navigator.share({title,text:description,url:publicUrl});
  else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(publicUrl);announce('무료 검사기 링크를 복사했습니다. 필요한 동료에게 전달하세요.');}
  else{window.prompt('무료 검사기 링크를 복사해 전달하세요.',publicUrl);}
 }catch(e){if(e?.name!=='AbortError')announce('공유가 취소되거나 실패했습니다. 링크를 복사해 직접 전달해 주세요.');}
});
window.WFPApp={getState:()=>({hasResult:!!last,demo:lastIsDemo,encoding,stats:last?.stats||null}),runSample:()=>byId('demo-button').click()};
})();