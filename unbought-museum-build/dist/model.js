
export const TYPES=['museum','laundry','market'];
export const GROUPS={museum:['shoes','bag','tech','home','coffee','other'],laundry:['worry','tired','sad','frustrated','mixed'],market:['books','tea','bread','flowers','noodles','plants']};
export const STATES={museum:['waiting','exhibited','purchased'],laundry:['washing','drying','folded'],market:['open','done']};
export function dayKey(ts=Date.now()){const d=new Date(ts);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
export function empty(kind){return {app:kind,version:1,theme:'default',items:[]}}
export function validate(raw,kind){
 if(!raw||raw.app!==kind||raw.version!==1||!Array.isArray(raw.items)||raw.items.length>2000)throw new Error('이 앱의 올바른 백업 파일이 아닙니다.');
 const ids=new Set();const items=raw.items.map(x=>{
  if(!x||typeof x.id!=='string'||!(/^[A-Za-z0-9_-]{1,80}$/).test(x.id)||ids.has(x.id)||typeof x.text!=='string'||!x.text.trim()||x.text.length>(kind==='laundry'?400:80)||!STATES[kind].includes(x.status)||!GROUPS[kind].includes(x.group)||!Number.isFinite(x.createdAt)||x.createdAt<0||x.createdAt>8640000000000000)throw new Error('기록 형식을 확인해 주세요.');
  ids.add(x.id);let item={id:x.id,text:x.text,group:x.group,status:x.status,createdAt:x.createdAt};
  if(kind==='museum'){if(!Number.isSafeInteger(x.amount)||x.amount<1||x.amount>1000000000||!Number.isFinite(x.readyAt)||x.readyAt<0||x.readyAt>8640000000000000)throw new Error('물건 금액이나 대기 시간이 올바르지 않습니다.');item.amount=x.amount;item.readyAt=x.readyAt;}
  if(kind==='laundry'){if(!Number.isFinite(x.readyAt)||x.readyAt<0||x.readyAt>8640000000000000)throw new Error('세탁 시간이 올바르지 않습니다.');item.readyAt=x.readyAt;}
  if(x.doneAt!==undefined){if(!Number.isFinite(x.doneAt)||x.doneAt<0||x.doneAt>8640000000000000)throw new Error('완료 시간이 올바르지 않습니다.');item.doneAt=x.doneAt;}
  if((x.status==='done'||x.status==='exhibited'||x.status==='folded')&&item.doneAt===undefined)throw new Error('완료 기록의 날짜가 없습니다.');
  return item;
 });return {app:kind,version:1,theme:raw.theme==='alternate'?'alternate':'default',items}
}
export function makeRecord(kind,data,now=Date.now()){
 const text=String(data.text||'').trim();if(!text)throw new Error(kind==='laundry'?'마음에 남은 한 줄을 적어주세요.':'내용을 먼저 적어주세요.');
 if(text.length>(kind==='laundry'?400:80))throw new Error('내용을 조금 짧게 적어주세요.');
 if(!GROUPS[kind].includes(data.group))throw new Error('종류를 선택해 주세요.');
 const id=globalThis.crypto?.randomUUID?.()||('r-'+now+'-'+Math.random().toString(36).slice(2));
 const item={id,text,group:data.group,createdAt:now,status:kind==='museum'?'waiting':kind==='laundry'?'washing':'open'};
 if(kind==='museum'){let amount=Number(data.amount);if(!Number.isSafeInteger(amount)||amount<1||amount>1000000000)throw new Error('금액은 1원에서 10억 원 사이의 정수로 적어주세요.');item.amount=amount;item.readyAt=now+(Number(data.waitDays)||1)*86400000;if(data.exhibit){item.status='exhibited';item.doneAt=now}}
 if(kind==='laundry')item.readyAt=now+8000;
 return item;
}
export function transition(kind,item,action,now=Date.now()){
 const x={...item};
 if(kind==='museum'){
  if(action==='exhibit'){x.status='exhibited';x.doneAt=now}
  else if(action==='purchase'){x.status='purchased';delete x.doneAt}
  else if(action==='reconsider'){x.status='waiting';x.readyAt=now+86400000;delete x.doneAt}
  else throw new Error('지원하지 않는 동작입니다.');
 }else if(kind==='laundry'){
  if(action==='dry'&&x.status==='washing'&&now>=x.readyAt)x.status='drying';
  else if(action==='fold'&&x.status==='drying'){x.status='folded';x.doneAt=now}
  else if(action==='rewash'){x.status='washing';x.readyAt=now+8000;delete x.doneAt}
  else throw new Error('아직 다음 단계로 넘어갈 수 없어요.');
 }else{
  if(action==='complete'&&x.status==='open'){x.status='done';x.doneAt=now}
  else if(action==='undo'&&x.status==='done'){x.status='open';delete x.doneAt}
  else throw new Error('지원하지 않는 동작입니다.');
 }
 return x;
}
export function metrics(kind,items,now=Date.now()){
 if(kind==='museum'){const e=items.filter(x=>x.status==='exhibited');return {count:e.length,amount:e.reduce((a,x)=>a+x.amount,0),waiting:items.filter(x=>x.status==='waiting').length}}
 if(kind==='laundry')return {count:items.filter(x=>x.status==='folded').length,working:items.filter(x=>x.status!=='folded').length,total:items.length};
 const done=items.filter(x=>x.status==='done'),today=done.filter(x=>dayKey(x.doneAt)===dayKey(now));
 return {today:today.length,total:done.length,lights:new Set(today.map(x=>x.group)).size,days:new Set(done.map(x=>dayKey(x.doneAt))).size};
}
