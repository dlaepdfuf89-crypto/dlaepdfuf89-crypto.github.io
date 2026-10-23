import {museumObject} from './artwork.js';

// The examples are display-only; never inserted into localStorage or metrics.
export const GALLERY_EXAMPLES=Object.freeze([
 Object.freeze({text:'눈여겨보던 운동화',amount:129000,group:'shoes'}),
 Object.freeze({text:'가벼운 외출 가방',amount:79000,group:'bag'}),
 Object.freeze({text:'집에서 쓰는 커피 도구',amount:48000,group:'coffee'})
]);
const GROUP_LABELS=Object.freeze({shoes:'신발',bag:'가방·패션',tech:'디지털',home:'생활용품',coffee:'취향용품',other:'그 밖의 물건'});
export function selectExhibits(items,limit=6){
 return items.filter(item=>item.status==='exhibited')
  .sort((a,b)=>(b.doneAt??b.createdAt)-(a.doneAt??a.createdAt)
   || b.createdAt-a.createdAt || a.id.localeCompare(b.id)).slice(0,limit);
}
export function galleryPresentation(items){
 const displayed=selectExhibits(items);
 const total=items.filter(item=>item.status==='exhibited').length;
 const mode=total===0?(items.length===0?'sample':'awaiting'):(displayed.length===1?'solo':displayed.length===2?'pair':'collection');
 return {total,displayed,mode,examples:mode==='sample'?GALLERY_EXAMPLES:[]};
}
function displayDate(ts){
 return new Date(ts).toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric'});
}
function exhibitionCard(item,index,{demo,esc,format,recentlyPlacedId}){
 const title=esc(item.text),price=format(item.amount),group=esc(GROUP_LABELS[item.group]||GROUP_LABELS.other);
 const dateText=demo?'':displayDate(item.doneAt??item.createdAt);
 const action=demo?'sample-prefill':'focus-exhibit',id=demo?String(index):esc(item.id);
 const label=demo?'저장되지 않은 예시 '+title+'을 입력 칸에 가져오기':title+' 등록 가격 '+price+'원, '+dateText+' 선택. 아래 기록 보기';
 return '<button type="button" class="gallery-slot gallery-slot-'+esc(item.group)+
  (index===0?' first-artifact':'')+(demo?' sample-slot':'')+
  (!demo&&item.id===recentlyPlacedId?' just-placed':'')+
  '" data-action="'+action+'" data-id="'+id+'" aria-label="'+label+'">'+
  '<span class="gallery-number">'+(demo?'저장되지 않은 예시':('EXHIBIT '+String(index+1).padStart(2,'0')))+'</span>'+
  '<span class="gallery-art">'+museumObject(item.group,demo?'':item.id,item.text)+'</span>'+
  '<span class="gallery-plinth" aria-hidden="true"></span>'+
  '<span class="gallery-item-label">'+
   '<span class="gallery-item-type">'+group+'</span>'+
   '<span class="gallery-item-name">'+title+'</span>'+
   '<span class="gallery-item-price">'+price+'원</span>'+
   '<span class="gallery-item-date">'+(demo?'눌러서 입력해보기':'선택한 날 · '+esc(dateText))+'</span>'+
  '</span></button>';
}
export function renderMuseumGallery({items,esc,format,recentlyPlacedId}){
 const host=document.getElementById('museum-gallery');
 if(!host)return;
 const g=galleryPresentation(items);
 const count=document.getElementById('gallery-count');
 count.textContent=g.total===0?'실제 전시품 0점':'실제 전시품 '+format(g.total)+'점';
 host.dataset.layout=g.mode;
 // This ceremony is shown only after a real, successfully persisted exhibition.
 // Samples, reloaded records and waiting/purchased items never trigger it.
 const moment=document.getElementById('gallery-moment');
 if(moment){
  const newcomer=recentlyPlacedId?g.displayed.find(x=>x.id===recentlyPlacedId):null;
  if(newcomer){
   moment.innerHTML='<span class="gallery-moment-signet" aria-hidden="true">✦</span>'+
    '<span class="gallery-moment-copy"><strong>새로운 전시품이 도착했어요</strong>'+
    '<span>'+esc(newcomer.text)+' · 나의 전시품 '+format(g.total)+'점</span></span>'+
    '<span class="gallery-moment-glint" aria-hidden="true">✧</span>';
   moment.hidden=false;
  }else{moment.hidden=true;moment.replaceChildren()}
 }
 const options={esc,format,recentlyPlacedId};
 if(g.mode==='awaiting'){
  host.innerHTML='<div class="gallery-awaiting"><div class="gallery-awaiting-symbol" aria-hidden="true">✦</div>'+
   '<strong>첫 전시품을 기다리고 있어요</strong>'+
   '<p>고민 중인 물건을 사지 않기로 선택하면 이곳에 전시됩니다.</p>'+
   '<button class="gallery-awaiting-action" type="button" data-action="focus-records">생각 중인 기록 보기 ↗</button></div>';
 }else{
  const entries=g.mode==='sample'?g.examples:g.displayed;
  host.innerHTML=entries.map((item,i)=>exhibitionCard(item,i,{...options,demo:g.mode==='sample'})).join('');
 }
 const note=document.getElementById('gallery-message');
 if(g.mode==='sample')note.innerHTML='지금 보이는 세 물건은 <strong>저장되지 않은 예시</strong>입니다. 나의 기록과 금액에 포함되지 않습니다. 물건을 눌러 첫 기록을 시작하세요.';
 else if(g.mode==='awaiting')note.textContent='이곳에는 전시로 결정한 물건만 보입니다. 구매·보류 상태의 금액은 집계하지 않습니다.';
 else note.textContent=(g.total>6?'최신 전시품 6점만 이 공간에 표시됩니다. 전체 '+format(g.total)+'점은 소장 기록에서 확인할 수 있습니다. ':'')+'전시품을 누르면 아래 내 기록으로 이동합니다. 실제 절약액이 아니라 등록 가격을 표시합니다.';
}
