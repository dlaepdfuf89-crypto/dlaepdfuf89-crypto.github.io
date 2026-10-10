'use strict';
const el=id=>document.getElementById(id);
function minutes(id){const v=el(id).value.trim();if(v==='')return null;const n=Number(v);return Number.isFinite(n)&&n>=0?n:NaN;}
function fmt(n){return (Math.round(n*10)/10).toLocaleString('en-US',{maximumFractionDigits:1});}
function calculate(){
  let count=0,sum=0,error='';
  const rows=[];
  for(let i=1;i<=3;i++){
    const old=minutes('old'+i),next=minutes('new'+i),base=minutes('base'+i),reuse=minutes('reuse'+i);
    const invalid=[old,next,base,reuse].some(x=>x!==null&&!Number.isFinite(x));
    if(invalid||base!==null&&next!==null&&base>next||reuse!==null&&next!==null&&reuse>next)error='Check invalid or inconsistent minutes in job '+i+'.';
    const saved=old!==null&&next!==null&&!invalid?old-next:null;
    if(saved!==null){count++;sum+=saved;}
    el('net'+i).textContent=saved===null?'Not measured':fmt(saved)+' min';
    rows.push([i,old,next,base,reuse,saved,saved===null?'INCOMPLETE':'RECORDED']);
  }
  if(error){count=0;sum=0;}
  const average=count?sum/count:null;
  el('count').textContent=count+' / 3';el('total').textContent=average===null?'—':fmt(sum)+' min';
  el('average').textContent=average===null?'—':fmt(average)+' min';
  el('status').textContent=error||(!count?'No measured jobs yet.':count===3?'All 3 paired tasks entered. Confirm the jobs are comparable.':count+' measured task(s), not yet a three-task sample.');
  const vol=minutes('volume'),hour=minutes('hourly'),curr=el('currency').value;
  const canProject=!error&&average!==null&&vol!==null&&Number.isInteger(vol)&&vol>0;
  el('monthly').textContent=canProject?fmt(average*vol)+' min':'—';
  const validCash=canProject&&hour!==null&&Number.isFinite(hour);
  el('money').textContent=validCash?new Intl.NumberFormat(curr==='KRW'?'ko-KR':'en-US',{style:'currency',currency:curr,maximumFractionDigits:curr==='KRW'?0:2}).format(average*vol*hour/60):'—';
  const each=validCash?average*hour/60:0;
  el('payback').textContent=each>0?Math.ceil((curr==='KRW'?49000:39)/each)+' jobs':'—';
  return {rows,error};
}
function csvCell(x){return '"'+String(x===null?'':x).replace(/"/g,'""')+'"';}
function exportCSV(){
  const result=calculate();if(result.error){el('status').textContent='Correct invalid minutes before exporting.';return;}
  const records=[['job','manual_total_minutes','deliveryproof_total_minutes','baseline_prep_included_minutes','reuse_setup_minutes','net_minutes_saved','status'],...result.rows,['NOTE','Self-reported timings only; not independent customer validation','','','','','']];
  const data='\uFEFF'+records.map(r=>r.map(csvCell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='DeliveryProof_Trial_Time_Study.csv';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',calculate));
el('csv').addEventListener('click',exportCSV);el('print').addEventListener('click',()=>window.print());calculate();
