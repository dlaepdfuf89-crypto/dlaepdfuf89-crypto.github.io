// Purely local batch quantity comparison for the public ORDER_MARGIN pilot.
// Imported math is the same trusted core.mjs as the store candidate.
// No tracking, localStorage, network transmission of entered costs, or purchases.
import {calculate,FIELD_LABELS} from './core.mjs';
const form=document.getElementById('calcForm');
const screen=document.getElementById('resultScreen');
const demo=document.getElementById('demo');
if(form&&screen){
 const wrap=document.createElement('section');
 wrap.id='orderQuantityCompare';
 wrap.className='panel';
 wrap.setAttribute('aria-label','인접 주문 수량에 따른 마진 비교');
 const heading=document.createElement('h2');heading.textContent='주문 수량이 바뀌면 얼마나 남을까요?';
 const intro=document.createElement('p');intro.className='panel-note';
 intro.textContent='같은 판매단가, 같은 주문 전체 할인액, 같은 총 작업시간을 가정해 수량만 비교합니다. 한 배치 생산량을 넘는 순간 추가 재료비가 발생할 수 있습니다.';
 const status=document.createElement('p');status.className='panel-note';status.id='quantityCompareStatus';status.setAttribute('role','status');
 const table=document.createElement('table');table.id='quantityCompareTable';
 table.style.width='100%';table.style.borderCollapse='collapse';table.style.fontSize='clamp(12px,2.8vw,14px)';
 const thead=document.createElement('thead');
 const hr=document.createElement('tr');
 const headings=['주문 수량','필요 배치','남는 제품','작업비 반영 잔액','손익분기 단가'];
 for(const h of headings){const th=document.createElement('th');th.scope='col';th.textContent=h;th.style.padding='8px 3px';th.style.textAlign='left';th.style.borderBottom='1px solid #c2d7d0';hr.append(th)}
 thead.append(hr);const tbody=document.createElement('tbody');table.append(thead,tbody);
 const note=document.createElement('p');note.className='panel-note';note.textContent='이 표는 입력한 재료·포장·수수료·할인·총 작업시간 조건만 반영한 가상 비교입니다. 실제 생산시간 변화, 불량·세금 등은 추가로 고려해야 하며 확정 수익이 아닙니다.';
 wrap.append(heading,intro,status,table,note);
 screen.append(wrap);
 const fmt=n=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(n);
 const cell=(row,str)=>{const td=document.createElement('td');td.textContent=str;td.style.padding='9px 3px';td.style.borderBottom='1px solid #e4ebe6';row.append(td);return td};
 function refresh(){
  try{
   tbody.replaceChildren();
   const raw={};
   for(const key of Object.keys(FIELD_LABELS)){const input=form.elements.namedItem(key);raw[key]=input?.value?.trim()||''}
   const main=calculate(raw);
   if(!main.valid){status.textContent='올바른 계산 입력이 있을 때만 수량 비교를 표시합니다.';table.hidden=true;return}
   if(main.missing.length){status.textContent='아직 비용 미입력 항목이 있어 수량별 손익 비교를 숨겼습니다. 비용을 모두 확인한 후 다시 계산해 주세요.';table.hidden=true;return}
   const quantity=main.values.quantity,lot=main.values.yield;
   const values=[quantity-1,quantity,quantity+1,Math.floor((quantity-1)/lot)*lot+1,Math.ceil(quantity/lot)*lot+1]
     .filter(v=>Number.isSafeInteger(v)&&v>=1&&v<=1_000_000_000_000);
   const quantities=[...new Set(values)].sort((a,b)=>a-b);
   let shown=0;
   for(const q of quantities){
    const scenario=calculate({...raw,quantity:String(q)});
    if(!scenario.valid)continue; // e.g. fixed discount greater than changed order revenue
    const r=scenario.result,tr=document.createElement('tr');
    if(q===quantity){tr.style.fontWeight='800';tr.style.background='#f0faf3'}
    cell(tr,fmt(q)+'개'+(q===quantity?' (현재)':''));
    cell(tr,fmt(r.batches)+'배치');
    cell(tr,fmt(r.leftover)+'개');
    const profit=cell(tr,(r.afterLabor<0?'−':'')+fmt(Math.abs(r.afterLabor))+'원');
    if(r.afterLabor<0)profit.style.color='#a63b2d';
    cell(tr,fmt(r.minimumPrice100)+'원');
    tbody.append(tr);shown++;
   }
   table.hidden=!shown;
   status.textContent=shown?'인접 수량과 배치 경계 '+shown+'개 경우를 비교했습니다. 가정이 달라지면 결과도 바뀝니다.':'비교 가능한 수량 조건이 없습니다.';
  }catch(error){table.hidden=true;status.textContent='수량 비교 계산을 표시할 수 없습니다. 기존 견적 결과는 계속 사용할 수 있습니다.'}
 }
 form.addEventListener('submit',()=>queueMicrotask(refresh));
 demo?.addEventListener('click',()=>queueMicrotask(refresh));
}
