
import {empty,validate,makeRecord,transition,metrics,dayKey,GROUPS} from './model.js';
const kind=document.body.dataset.app, key='little-worlds.'+kind+'.v1';
const previousImportKey=kind==='market'?key+'.before-import':null;
const CONFIG=JSON.parse(document.getElementById('app-config').textContent);
const $=s=>document.querySelector(s);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const format=n=>new Intl.NumberFormat('ko-KR').format(n);
const date=ts=>new Date(ts).toLocaleDateString('ko-KR',{month:'long',day:'numeric'});
const ICONS={
 museum:'M3 9h18M4 20h16M5 9v11m5-11v11m4-11v11m5-11v11M3 8l9-5 9 5',
 laundry:'M5 3h14v18H5zM8 6h1m3 0h4M12 18a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9',
 market:'M3 10l2-6h14l2 6M4 11v10h16V11M9 21v-7h6v7M3 10c0 4 4 4 4 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 4 4 4 0',
 archive:'M4 8h16v13H4zM3 3h18v5H3zM9 12h6',
 settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2',
 lock:'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
 check:'M5 12l4 4L19 6',plus:'M12 5v14M5 12h14',close:'M6 6l12 12M6 18L18 6',
 arrow:'M5 12h14m-5-5 5 5-5 5',spark:'m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z',
 shoes:'M3 14V9h5l3 5 9 2v4H3zM9 12l3-2m0 4 3-2M3 17h17',
 bag:'M5 7h14l1 14H4zM8 8V6a4 4 0 0 1 8 0v2',
 tech:'M6 2h12v20H6zM10 18h4M9 5h6',
 home:'M3 10l9-7 9 7M5 9v12h14V9M10 21v-7h4v7',
 coffee:'M4 7h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 8h2a3 3 0 0 1 0 6h-2M7 2v2m5-2v2',
 other:'M3 7l9-4 9 4v11l-9 4-9-4zM3 7l9 5 9-5M12 12v10',
 heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8',
 books:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16M6 8h3m-3 4h3m6-4h3m-3 4h3',
 tea:'M4 9h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM17 10h2a3 3 0 0 1 0 6h-2M8 3v3m5-3v3',
 bread:'M5 9a4 4 0 0 1 1-8 4 4 0 0 1 6 0 4 4 0 0 1 6 0 4 4 0 0 1 1 8v12H5zM9 13v4m6-4v4',
 flowers:'M12 21v-9M12 18l-5-4m5 1 5-3M12 3c4-5 8 3 3 4 5 4-3 8-3 3-4 5-8-3-3-3-5-4 3-8 3-4',
 noodles:'M3 12h18a9 9 0 0 1-18 0M7 21h10M8 3v6m4-7v7m4-6v6',
 plants:'M7 14h10l-1 8H8zM12 14V6M12 10c-7 0-8-8-8-8 7 0 8 5 8 8M12 9c0-6 8-7 8-7 0 7-4 8-8 7',
 share:'M12 16V3m-4 4 4-4 4 4M5 12v9h14v-9',
 download:'M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5'
};
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+(ICONS[name]||ICONS.spark)+'"/></svg>'}
const labels={museum:{shoes:'신발',bag:'가방·패션',tech:'디지털',home:'생활용품',coffee:'취향용품',other:'그 밖의 물건'},laundry:{worry:'걱정이 많아요',tired:'조금 지쳤어요',sad:'마음이 가라앉아요',frustrated:'속상한 일이 있어요',mixed:'설명하기 어려워요'},market:{books:'달빛 책방',tea:'온기 찻집',bread:'새벽 빵집',flowers:'소소 꽃집',noodles:'한그릇 식당',plants:'초록 화원'}};
// These image coordinates match the six distinct shops in assets/scene.png.
const shopMarkers={tea:[16,21,'찻집'],books:[42,41,'책방'],bread:[83,29,'빵집'],flowers:[18,65,'꽃집'],noodles:[65,65,'식당'],plants:[89,76,'화원']};
const shopStories={
 books:['책 한 쪽에서 시작하는 조용한 밤','오늘의 짧은 독서와 작은 배움도 이 가게의 불빛이 될 수 있어요.'],
 tea:['따뜻하게 쉬어가는 작은 시간','물 한 잔, 숨 고르기처럼 나를 챙기는 일도 충분히 소중해요.'],
 bread:['새로운 하루를 준비하는 손길','자잘한 준비와 약속을 하나씩 마쳤다면 이곳에 기록해 보세요.'],
 flowers:['하루를 아름답게 가꾸는 마음','주변을 정돈하고 작은 것을 돌보는 시간을 남겨 보세요.'],
 noodles:['나에게 차려준 다정한 한 끼','식사를 챙기거나 생활 속 실천을 끝냈다면 이곳에 불을 켜 보세요.'],
 plants:['조금씩 자라는 나의 일상','정리, 가꾸기, 산책처럼 가벼운 일도 이곳에서 빛이 됩니다.']
};
let openingTimer;
function clearOpening(){
 clearTimeout(openingTimer);
 $('#opening-banner').classList.remove('show');
 $('#opening-bloom').classList.remove('show');
 $('#opening-motes').classList.remove('show');
 $('#opening-ticket').classList.remove('show');
 $('#opening-ticket').setAttribute('aria-hidden','true');
 document.querySelectorAll('.shop-pin.just-opened').forEach(p=>p.classList.remove('just-opened'));
}
function showOpening(group){
 if(kind!=='market'||!shopMarkers[group])return;
 clearOpening();
 const banner=$('#opening-banner'),bloom=$('#opening-bloom'),motes=$('#opening-motes'),pos=shopMarkers[group];
 const lights=metrics(kind,state.items).lights;
 const ticket=$('#opening-ticket');
 ticket.dataset.group=group;
 $('#ticket-image').src='assets/shop-'+group+'.webp';
 $('#ticket-shop').textContent=labels.market[group];
 $('#ticket-eyebrow').textContent=lights===6?'ALL SIX LIGHTS ARE ON':'LIGHT '+String(lights).padStart(2,'0')+' / 06';
 $('#ticket-message').textContent=lights===6?'여섯 가게가 모두 환하게 빛나요.':shopStories[group][0];
 banner.textContent=lights===6?'오늘 여섯 가게에 모두 불이 켜졌어요!':labels.market[group]+' · 문을 열었어요!';
 bloom.style.setProperty('--light-x',pos[0]+'%');
 bloom.style.setProperty('--light-y',pos[1]+'%');
 motes.style.setProperty('--light-x',pos[0]+'%');
 motes.style.setProperty('--light-y',pos[1]+'%');
 const spread=[-11,-7,-3,0,3,7,11],drift=[-37,-24,-13,0,13,24,37];
 motes.innerHTML=spread.map((start,i)=>'<i class="light-mote" style="--start:'+start+'px;--drift:'+drift[i]+'px;--delay:'+(i*65)+'ms"></i>').join('');
 void bloom.offsetWidth;
 banner.classList.add('show');bloom.classList.add('show');motes.classList.add('show');
 ticket.classList.add('show');ticket.setAttribute('aria-hidden','false');
 const pin=document.querySelector('.shop-pin[data-shop="'+group+'"]');
 pin?.classList.add('just-opened');
 openingTimer=setTimeout(clearOpening,3400);
}
const nav=['home','archive'];
let state=empty(kind),view='home',filter='all',loadFailed=false,toastTimer,lastDay=dayKey();
try{const saved=localStorage.getItem(key);if(saved)state=validate(JSON.parse(saved),kind)}catch(e){loadFailed=true;$('#storage-warning').hidden=false;$('#storage-warning').textContent='저장된 기록을 읽을 수 없어 원본을 보호하고 있습니다. 설정에서 원본을 백업한 뒤 복구해 주세요. '+e.message}
function commit(next){
 if(loadFailed){toast('원본 보호 중입니다. 먼저 설정에서 백업 또는 복구해 주세요.');return false}
 try{next=validate(next,kind);localStorage.setItem(key,JSON.stringify(next));state=next;return true}
 catch(e){toast('저장하지 못했습니다. 기록은 변경되지 않았어요. '+e.message);return false}
}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('on'),4000)}
function button(text,action,id,cls='quiet'){return '<button class="'+cls+'" data-action="'+action+'"'+(id?' data-id="'+esc(id)+'"':'')+'>'+text+'</button>'}
function setView(next){view=next;filter='all';render();window.scrollTo({top:0,behavior:'smooth'})}
function openModal(title,html){$('#modal-title').textContent=title;$('#modal-content').innerHTML=html;$('#modal').showModal()}
function showShopPreview(group){
 if(kind!=='market'||!GROUPS.market.includes(group))return;
 const opened=state.items.filter(x=>x.group===group&&x.status==='done'&&dayKey(x.doneAt)===dayKey()).length;
 const [tagline,description]=shopStories[group];
 const content='<article class="shop-preview">'
  +'<div class="shop-preview-picture"><img src="assets/shop-'+group+'.webp" width="256" height="256" alt="'+esc(labels.market[group])+' 실제 골목 가게 그림">'
  +'<span class="shop-preview-seal '+(opened?'lit':'')+'">'+(opened?'✦ TODAY OPEN':'✧ STILL DREAMING')+'</span></div>'
  +'<div class="shop-preview-body"><p class="shop-preview-eyebrow">ONE MORE LIGHT · YOUR LITTLE STREET</p>'
  +'<h3>'+esc(tagline)+'</h3><p>'+esc(description)+'</p>'
  +'<div class="shop-preview-state"><span class="shop-preview-status '+(opened?'lit':'')+'">'+(opened?'오늘 불이 켜졌어요':'아직 불을 기다리고 있어요')+'</span>'
  +'<strong>'+opened+'<small>개의 완료 기록</small></strong></div>'
  +'<p class="shop-preview-note">원하는 일을 자유롭게 적을 수 있어요. 실제 완료할 때만 불이 켜집니다.</p>'
  +'<button type="button" class="shop-preview-action" data-pick-shop="'+group+'">'+icon('plus')+' 이 가게에 할 일 적기</button></div></article>';
 openModal(labels.market[group],content);
}
function closeModal(){$('#modal').close()}
function renderTheatre(){
 if(kind!=='market')return;
 const lit=new Set(state.items.filter(x=>x.status==='done'&&dayKey(x.doneAt)===dayKey()).map(x=>x.group));
 const count=GROUPS.market.filter(x=>lit.has(x)).length;
 $('#street-theatre .theatre-scene').style.setProperty('--street-ambient',(0.60+count*0.065).toFixed(2));
 $('#theatre-count').textContent='오늘 '+count+' / 6곳에 불이 켜졌어요';
 $('#theatre-lights').innerHTML=GROUPS.market.filter(x=>lit.has(x)).map(x=>{
  const p=shopMarkers[x];
  return '<i class="theatre-halo" style="--x:'+p[0]+'%;--y:'+p[1]+'%" aria-hidden="true"></i>';
 }).join('');
 $('#theatre-shops').innerHTML=GROUPS.market.map((x,i)=>{
  const opened=lit.has(x);
  return '<button type="button" class="theatre-shop '+(opened?'lit':'')+'" data-theatre-shop="'+x+'" aria-label="'+esc(labels.market[x])+' '+(opened?'오늘 영업 중':'오늘 아직 미점등')+' · 가게 이야기 보기">'
   +'<img src="assets/shop-'+x+'.webp" alt="" width="62" height="62">'
   +'<span class="theatre-shop-label"><small>'+(opened?'✦ OPEN':'0'+(i+1)+' · CLOSED')+'</small><strong>'+esc(labels.market[x])+'</strong></span>'
   +'<span class="theatre-shop-arrow" aria-hidden="true">↗</span></button>';
 }).join('');
}
function showTheatre(){
 if(kind!=='market'||$('#modal').open)return;
 clearOpening();renderTheatre();$('#street-theatre').showModal();
}
function opts(kind){return GROUPS[kind].map(x=>'<option value="'+x+'">'+labels[kind][x]+'</option>').join('')}
function init(){
 document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
 $('#today-label').textContent=new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});
 if(kind==='museum')$('#entry-form').innerHTML='<label class="field fullfield"><span>물건 이름</span><input name="text" required maxlength="80" placeholder="예: 눈여겨보던 운동화" autocomplete="off"></label><div class="field-row"><label class="field"><span>가격 · 원</span><input name="amount" required type="number" min="1" max="1000000000" step="1" inputmode="numeric" placeholder="129000"></label><label class="field"><span>전시 종류</span><select name="group">'+opts(kind)+'</select></label></div><label class="field fullfield"><span>생각할 시간</span><select name="waitDays"><option value="1">하루만 기다려볼게요</option><option value="3">3일 동안 생각할게요</option><option value="7">일주일 뒤에 다시 볼게요</option></select></label><label class="check"><input name="exhibit" type="checkbox">이미 사지 않기로 했어요 · 바로 전시하기</label><button class="primary wide" type="submit">'+icon('plus')+'나의 선택 남기기</button>';
 if(kind==='laundry')$('#entry-form').innerHTML='<label class="field fullfield"><span>지금 마음에 남은 한 줄</span><textarea name="text" required maxlength="400" placeholder="내일 해야 할 일이 자꾸 생각나요…" rows="3"></textarea></label><label class="field fullfield"><span>오늘의 마음</span><select name="group">'+opts(kind)+'</select></label><button class="primary wide" type="submit">'+icon('laundry')+'세탁 맡기기</button><p class="form-note">'+icon('lock')+'내용은 펼쳐볼 때만 화면에 나타나요</p>';
 if(kind==='market')$('#entry-form').innerHTML='<label class="field fullfield"><span>현실에서 할 작은 일</span><input name="text" required maxlength="80" placeholder="예: 책상 위 5분만 정리하기" autocomplete="off"></label><label class="field fullfield"><span>이 일을 끝내면 열릴 가게</span><select name="group">'+opts(kind)+'</select></label><p class="sub fullfield">끝낸 일에 체크하면 가게에 불이 켜져요.<br>하루에 여섯 가게를 밝힐 수 있어요.</p><button class="primary wide" type="submit">'+icon('plus')+'오늘의 할 일 적기</button>';
 if(kind==='market'){
   $('.hero-caption').insertAdjacentHTML('afterend','<div class="premium-hero-controls"><div class="premium-counter" aria-label="오늘 켜진 가게"><span class="premium-counter-mark">'+icon('market')+'</span><div class="premium-counter-text"><span class="premium-counter-title">오늘의 골목</span><strong id="premium-lights">0 / 6곳에 불이 켜졌어요</strong><span class="premium-track"><i id="premium-track-fill"></i></span></div><span class="premium-counter-chevron" aria-hidden="true">✦</span></div><button id="premium-quick-start" type="button" class="premium-quick-start">'+icon('plus')+' 오늘의 할 일 적기 <span aria-hidden="true">✦</span></button></div>');
   $('#premium-quick-start').addEventListener('click',()=>{
      const input=$('#entry-form input[name="text"]');
      input?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
      input?.focus({preventScroll:true});
   });
 }
 $('#entry-form').insertAdjacentHTML('beforeend','<p class="error fullfield" id="form-error" role="alert"></p>');
 $('#entry-form').addEventListener('submit',e=>{
  e.preventDefault();$('#form-error').textContent='';
  const data=Object.fromEntries(new FormData(e.target));data.exhibit=data.exhibit==='on';
  try{
   const item=makeRecord(kind,data),firstMarketTask=kind==='market'&&state.items.length===0;
   if(commit({...state,items:[item,...state.items]})){
    e.target.reset();render();
    if(kind!=='market')toast(kind==='museum'?(item.status==='exhibited'?'첫 선택이 전시대에 놓였어요.':'물건을 맡겼어요. 천천히 결정해 보세요.'):'마음을 맡겼어요. 8초 동안 잠시 쉬어가세요.');
    if(firstMarketTask){
      const firstAction=$('#records .record .task-check');
      e.target.querySelector('[name="text"]')?.blur();
      firstAction?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      firstAction?.focus({preventScroll:true});
    }
   }
  }catch(err){$('#form-error').textContent=err.message}
 });
 $('#ticket-dismiss').addEventListener('click',clearOpening);
 $('#modal-close').addEventListener('click',closeModal);
 $('#street-expand').addEventListener('click',showTheatre);
 $('#theatre-close').addEventListener('click',()=>$('#street-theatre').close());
 $('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
 document.addEventListener('click',e=>{
  const idea=e.target.closest('[data-suggestion]');
  if(idea&&kind==='market'){const form=$('#entry-form');form.elements.text.value=idea.dataset.suggestion;form.elements.group.value=idea.dataset.suggestGroup;form.elements.text.focus();return}
  const theatreShop=e.target.closest('[data-theatre-shop]');
  if(theatreShop&&kind==='market'&&GROUPS.market.includes(theatreShop.dataset.theatreShop)){
   const group=theatreShop.dataset.theatreShop;
   $('#street-theatre').close();showShopPreview(group);return;
  }
  const detail=e.target.closest('[data-shop-detail]');
  if(detail&&kind==='market'){showShopPreview(detail.dataset.shopDetail);return}
  const pick=e.target.closest('[data-pick-shop]');
  if(pick&&kind==='market'&&GROUPS.market.includes(pick.dataset.pickShop)){
   const chosen=pick.dataset.pickShop;
   closeModal();
   if(view!=='home')setView('home');
   const form=$('#entry-form'),input=form?.elements.text;
   if(form&&input){form.elements.group.value=chosen;input.scrollIntoView({block:'center',behavior:'instant'});input.focus({preventScroll:true})}
   return;
  }
  const b=e.target.closest('[data-view],[data-action],[data-filter]');if(!b)return;if(b.dataset.view){setView(b.dataset.view);return}if(b.dataset.filter){filter=b.dataset.filter;render();return}handle(b.dataset.action,b.dataset.id)});
 $('#import-file').addEventListener('change',importFile);
 window.addEventListener('storage',e=>{if(e.key===key){try{state=e.newValue?validate(JSON.parse(e.newValue),kind):empty(kind);loadFailed=false;$('#storage-warning').hidden=true;render()}catch(_){toast('다른 창의 기록을 읽지 못했습니다. 새로고침 후 확인해 주세요.')}}});
 render();setInterval(tick,1000);
}
function render(){
 document.body.dataset.theme=state.theme;
 $('#home-section').hidden=view!=='home';$('#archive-heading').hidden=view!=='archive';
 document.querySelectorAll('[data-view]').forEach(e=>{e.classList.toggle('active',e.dataset.view===view);e.setAttribute('aria-current',e.dataset.view===view?'page':'false')});
 const m=metrics(kind,state.items),values=kind==='museum'?[[format(m.amount),'원','전시한 물건의 등록 금액'],[m.count,'점','나의 전시품'],[m.waiting,'개','생각 중인 물건']]:kind==='laundry'?[[m.count,'장','접어둔 마음'],[m.working,'장','세탁 중인 마음'],[m.total,'번','나에게 건넨 시간']]:[[m.today,'개','오늘 끝낸 일'],[m.lights+'/6','곳','오늘 켠 가게'],[m.days,'일','불을 켰던 날']];
 $('#metrics').innerHTML=values.map(x=>'<div class="metric"><span class="metric-label">'+x[2]+'</span><strong>'+x[0]+'</strong><em>'+x[1]+'</em></div>').join('');
 $('#hero-state').innerHTML=icon(kind==='market'?'spark':kind)+'<span>'+(kind==='museum'?'나의 전시품 '+m.count+'점':kind==='laundry'?m.working>0?'마음 '+m.working+'장 세탁 중':'오늘도 따뜻하게 영업 중':'오늘 '+m.lights+'곳의 가게가 켜졌어요')+'</span>';
 if(kind==='market'){
  $('#premium-lights').textContent=m.lights+' / 6곳에 불이 켜졌어요';
  $('#premium-track-fill').style.width=(m.lights/6*100)+'%';
  if($('#street-theatre').open)renderTheatre();
 }
 $('#record-title').textContent=kind==='museum'?(view==='home'?'내 선택이 머무는 곳':'나의 소장 기록'):kind==='laundry'?(view==='home'?'오늘 맡긴 마음':'차곡차곡 접어둔 마음'):(view==='home'?'오늘의 작은 실천':'골목이 밝아진 기록');
 $('#record-subtitle').textContent=kind==='museum'?'천천히 결정해도 괜찮아요':kind==='laundry'?'읽고 싶을 때만 펼쳐보세요':'작은 일도 충분히 멋진 일이에요';
 const options=kind==='museum'?(view==='home'?[['all','모두'],['waiting','생각 중'],['exhibited','전시 중']]:[['all','모두'],['exhibited','전시품'],['purchased','구매한 물건']]):kind==='market'&&view==='home'?[['all','모두'],['open','할 일'],['done','오늘 완료']]:[];
 $('#filters').innerHTML=options.map(x=>'<button class="pill '+(filter===x[0]?'active':'')+'" data-filter="'+x[0]+'" aria-pressed="'+(filter===x[0])+'">'+x[1]+'</button>').join('');
 let items=state.items.filter(x=>kind==='museum'?(view==='archive'?x.status!=='waiting':x.status!=='purchased'):kind==='laundry'?(view==='archive'?x.status==='folded':x.status!=='folded'):(view==='archive'?x.status==='done':x.status==='open'||dayKey(x.doneAt)===dayKey()));
 if(filter!=='all')items=items.filter(x=>x.status===filter);
 if(view==='archive')items.sort((a,b)=>(b.doneAt||b.createdAt)-(a.doneAt||a.createdAt));
 $('#records').classList.toggle('market-records',kind==='market');
 $('#records').innerHTML=items.length?items.map(recordCard).join(''):'<div class="empty"><div class="empty-icon">'+icon(kind==='laundry'?'heart':kind)+'</div><h3>'+(view==='home'?CONFIG.empty:'아직 보관된 기록이 없어요.')+'</h3><p>'+(view==='home'?CONFIG.emptysub:kind==='laundry'?'세탁이 끝난 마음을 걷어 보관해 보세요.':kind==='market'?'현실에서 끝낸 일에 체크하면 영업 일지가 쌓여요.':'사지 않기로 한 물건이 여기에 모여요.')+'</p></div>';
 if(kind==='laundry')$('.hero').classList.toggle('doing-laundry',state.items.some(x=>x.status==='washing'));
 if(kind==='market'){
  const lit=new Set(state.items.filter(x=>x.status==='done'&&dayKey(x.doneAt)===dayKey()).map(x=>x.group));
  $('#starter-panel').hidden=state.items.length>0;
  const step=$('#next-step');
  step.hidden=state.items.length===0;
  if(!step.hidden)step.textContent=m.today>0?'오늘 '+m.today+'개를 완료했어요. '+m.lights+'곳의 가게가 켜졌습니다. 작은 한 걸음도 충분해요.':'2단계 · 아래 할 일에서 「완료하고 불 켜기」를 눌러보세요. 그때만 실제 가게에 불이 켜집니다.';
  $('#shop-pins').innerHTML=GROUPS.market.map(x=>{
   const pos=shopMarkers[x];return '<div class="shop-pin '+(lit.has(x)?'lit':'')+'" data-shop="'+x+'" style="--px:'+pos[0]+'%;--py:'+pos[1]+'%"><span class="pin-sign"><span class="pin-icon">'+icon(x)+'</span><span class="pin-name">'+pos[2]+'</span><span class="pin-lamp"></span></span><span class="pin-door"></span></div>';
  }).join('');
  $('#street-reflections').innerHTML=GROUPS.market.map(x=>{
   const pos=shopMarkers[x];return '<span class="street-reflection '+(lit.has(x)?'lit':'')+'" data-reflection="'+x+'" style="--px:'+pos[0]+'%;--py:'+pos[1]+'%"></span>';
  }).join('');
  $('#shops').innerHTML=GROUPS.market.map((x,i)=>'<button type="button" data-shop-detail="'+x+'" class="shop '+(lit.has(x)?'lit':'')+'" aria-label="'+labels.market[x]+(lit.has(x)?' 영업 중':' 아직 불이 꺼져 있어요')+' · 가게 이야기 보기"><span class="shop-art"><img src="assets/shop-'+x+'.webp" alt="" loading="lazy"><span class="shop-art-state" aria-hidden="true">'+(lit.has(x)?'✦ OPEN':'CLOSED')+'</span></span><span class="shop-foot"><span class="shop-num">0'+(i+1)+'</span><span class="shop-title">'+labels.market[x]+'</span><span class="shop-light-icon">'+icon(x)+'</span></span></button>').join('');
  $('#market-glow').classList.toggle('glow',lit.size>0);
  document.querySelectorAll('[data-shop-light]').forEach(e=>e.classList.toggle('on',lit.has(e.dataset.shopLight)));
 }tickLabels();
}
function recordCard(x){
 if(kind==='museum'){
  const tag=x.status==='waiting'?'생각 중':x.status==='exhibited'?'소장 완료':'구매한 물건';
  return '<article class="record"><span class="record-tag">'+tag+'</span><div class="exhibit"><div class="glass">'+icon(x.group)+'</div></div><div class="record-body"><span class="record-meta">'+labels.museum[x.group]+' · '+date(x.createdAt)+'</span><h3>'+esc(x.text)+'</h3><div class="money">'+format(x.amount)+'<span style="font-size:11px"> 원</span></div>'+(x.status==='waiting'?'<span class="record-meta" data-ready="'+x.readyAt+'"></span>':'<span class="record-meta">'+(x.status==='exhibited'?'사지 않은 나의 선택':'구매하지 않은 금액에서 제외됩니다')+'</span>')+'<div class="record-actions">'+(x.status==='waiting'?button('전시하기','exhibit',x.id)+button('구매했어요','purchase',x.id,'secondary'):button('다시 생각하기','reconsider',x.id,'secondary'))+button('삭제','ask-delete',x.id,'link-button')+'</div></div></article>';
 }
 if(kind==='laundry'){
  const tag=x.status==='washing'?'세탁 중':x.status==='drying'?'바람에 말리는 중':'보관 완료';
  return '<article class="record '+x.status+'"><span class="record-tag">'+tag+'</span><div class="cloth-scene">'+(x.status==='folded'?'':'<div class="clothesline"></div>')+'<div class="cloth">'+icon('heart')+'</div></div><div class="record-body"><span class="record-meta">'+date(x.createdAt)+'의 마음</span><h3>'+labels.laundry[x.group]+'</h3>'+(x.status==='washing'?'<span class="countdown" data-wash="'+x.readyAt+'">마음을 세탁하고 있어요</span><div class="ritual-progress"><span data-progress="'+x.readyAt+'"></span></div>':'<span class="record-meta">'+(x.status==='drying'?'잠시 내려놓은 마음을 접어둘까요?':'필요할 때 다시 펼쳐보세요.')+'</span>')+'<div class="record-actions">'+(x.status==='drying'?button('빨래 걷기','fold',x.id):'')+button('펼쳐보기','read',x.id,'secondary')+button('삭제','ask-delete',x.id,'link-button')+'</div></div></article>';
 }
 return '<article class="record '+(x.status==='done'?'task-done':'')+'"><img class="journal-shop-art" src="assets/shop-'+x.group+'.webp" loading="lazy" alt=""><div class="record-body"><div class="task-line"><button class="task-check '+(x.status==='done'?'done':'')+'" data-action="'+(x.status==='done'?'undo':'complete')+'" data-id="'+x.id+'" aria-label="'+esc(x.text)+(x.status==='done'?' 완료 취소':' 완료하기')+'">'+(x.status==='done'?icon('check'):'')+'</button><div class="task-copy"><span class="shop-tag">'+icon(x.group)+labels.market[x.group]+'</span><h3>'+esc(x.text)+'</h3><span class="record-meta">'+(x.status==='done'?date(x.doneAt)+' · 가게에 불을 켰어요':date(x.createdAt)+'에 적은 일')+'</span><div class="record-actions">'+button(x.status==='done'?'완료 취소':'완료하고 불 켜기',x.status==='done'?'undo':'complete',x.id,x.status==='done'?'secondary':'quiet')+button('삭제','ask-delete',x.id,'link-button')+'</div></div></div></div></article>';
}
function tickLabels(){
 const now=Date.now();
 document.querySelectorAll('[data-ready]').forEach(e=>{const ms=Number(e.dataset.ready)-now;e.textContent=ms<=0?'다시 생각해볼 시간이 되었어요':Math.ceil(ms/3600000)+'시간 뒤 다시 보기'});
 document.querySelectorAll('[data-wash]').forEach(e=>e.textContent=Math.max(0,Math.ceil((Number(e.dataset.wash)-now)/1000))+'초 후 세탁이 끝나요');
 document.querySelectorAll('[data-progress]').forEach(e=>e.style.width=Math.max(0,Math.min(100,(1-(Number(e.dataset.progress)-now)/8000)*100))+'%');
}
function tick(){
 if(lastDay!==dayKey()){lastDay=dayKey();$('#today-label').textContent=new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});render();}
 if(kind==='laundry'&&!loadFailed){const due=state.items.filter(x=>x.status==='washing'&&x.readyAt<=Date.now());if(due.length){if(commit({...state,items:state.items.map(x=>due.some(d=>d.id===x.id)?transition(kind,x,'dry'):x)})){render();toast('세탁이 끝났어요. 마음을 곱게 접어둘까요?')}}}
 tickLabels();
}
function handle(action,id){
 if(action==='settings'){settings();return}
 if(action==='theme-default'||action==='theme-alternate'){if(commit({...state,theme:action==='theme-default'?'default':'alternate'})){render();settings(true)}return}
 if(action==='export'){exportFile(false);return}
 if(action==='export-raw'){exportFile(true);return}
 if(action==='export-previous'&&kind==='market'){exportFile(false,true);return}
 if(action==='import'){closeModal();$('#import-file').click();return}
 if(action==='share'){shareSummary();return}
 if(action==='copy-share'){if(!navigator.clipboard){toast('문구를 길게 눌러 복사해 주세요.');return}navigator.clipboard.writeText($('#share-copy').value).then(()=>toast('소개 문구를 복사했어요.')).catch(()=>toast('문구를 길게 눌러 복사해 주세요.'));return}
 if(action==='cancel'){closeModal();return}
 if(action==='confirm-import'){
  if(pendingImport){
   let oldBackup=null,backupUpdated=false;
   try{
    const existing=localStorage.getItem(key);
    if(previousImportKey){
     oldBackup=localStorage.getItem(previousImportKey);
     if(existing!==null&&(state.items.length>0||loadFailed)){
      localStorage.setItem(previousImportKey,existing);
      backupUpdated=true;
     }
    }
    localStorage.setItem(key,JSON.stringify(pendingImport));
    state=pendingImport;pendingImport=null;loadFailed=false;
    $('#storage-warning').hidden=true;closeModal();render();
    toast(backupUpdated?'기록을 복구했어요. 교체 전 기록은 나의 공간에서 보관할 수 있어요.':'백업에서 기록을 복구했어요.');
   }catch(e){
    if(backupUpdated){
     try{if(oldBackup===null)localStorage.removeItem(previousImportKey);else localStorage.setItem(previousImportKey,oldBackup)}catch(_){}
    }
    toast('복구하지 못했습니다. 현재 기록은 유지됩니다.');
   }
  }
  return
 }
 const item=state.items.find(x=>x.id===id);if(!item)return;
 if(action==='ask-delete'){openModal('이 기록을 지울까요?','<p>선택한 기록 한 개를 삭제합니다. 삭제한 기록은 백업 파일이 있어야 복구할 수 있어요.</p><div class="modal-actions">'+button('삭제하기','delete',id,'primary')+button('취소','cancel',null,'secondary')+'</div>');return}
 if(action==='delete'){if(commit({...state,items:state.items.filter(x=>x.id!==id)})){closeModal();render();toast('선택한 기록을 삭제했어요.')}return}
 if(action==='read'){openModal(date(item.createdAt)+'에 맡긴 마음','<div class="note-text">'+esc(item.text)+'</div><p>'+labels.laundry[item.group]+' · 이 내용은 이 브라우저에만 보관됩니다.</p><div class="modal-actions">'+(item.status==='folded'?button('다시 세탁하기','rewash',id,'quiet'):'')+button('접어두기','cancel',null,'secondary')+'</div>');return}
 try{const wasLit=kind==='market'&&state.items.some(x=>x.status==='done'&&x.group===item.group&&dayKey(x.doneAt)===dayKey());const next=transition(kind,item,action);if(commit({...state,items:state.items.map(x=>x.id===id?next:x)})){if($('#modal').open)closeModal();render();if(kind==='market'&&action==='complete'){if(!wasLit){showOpening(item.group);$('#shops').classList.remove('celebrate');void $('#shops').offsetWidth;$('#shops').classList.add('celebrate');if(window.matchMedia('(max-width:640px)').matches){$('.hero').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}}}else if(kind==='market'&&action==='undo'){const lightRemains=state.items.some(x=>x.status==='done'&&x.group===item.group&&dayKey(x.doneAt)===dayKey());if(!lightRemains)clearOpening();}else if(kind==='museum'&&action==='exhibit')toast('사지 않은 선택이 전시품이 되었어요.');else if(kind==='laundry'&&action==='fold')toast('마음을 곱게 접어 보관했어요.');else toast('기록을 바꿨어요.')}}catch(e){toast(e.message)}
}
function settings(update=false){
 let hasPreviousImport=false;
 if(previousImportKey){try{hasPreviousImport=!!localStorage.getItem(previousImportKey)}catch(_){}}
 const themeLabels=kind==='museum'?['오후의 전시실','초록 정원']:kind==='laundry'?['보랏빛 밤','복숭아빛 저녁']:['달빛 골목','자줏빛 밤'];
 const html='<p>'+(kind==='market'?'가게 여섯 곳의 불빛과 영업 일지, 화면 테마와 JSON 백업은 모두 무료로 이용할 수 있습니다. 유료 결제는 아직 제공하지 않습니다.':'이 앱은 첫 시제품입니다. 현재 제공되는 기능과 두 가지 화면 분위기는 무료로 체험할 수 있습니다.')+'</p><div class="settings-group"><h3>나의 화면 분위기</h3><div class="theme-options">'+themeLabels.map((x,i)=>'<button class="theme-option '+(state.theme===(i?'alternate':'default')?'selected':'')+'" data-action="theme-'+(i?'alternate':'default')+'" aria-pressed="'+(state.theme===(i?'alternate':'default'))+'">'+x+'</button>').join('')+'</div></div><div class="settings-group"><h3>기록과 백업</h3><p>'+(kind==='market'?'기록은 사용 중인 이 기기의 앱 또는 브라우저에만 저장됩니다. 기기 간 자동 동기화나 재설치 후 복구는 제공하지 않습니다. 앱 삭제·데이터 초기화 전에 JSON 백업을 별도 장소에 저장해 주세요. 백업에는 실제 기록 원문이 포함됩니다.':'기록은 현재 기기의 이 브라우저에 저장됩니다. 다른 기기와 자동 동기화되지 않으며, 브라우저 데이터를 지우면 사라질 수 있습니다. 백업 파일은 내용이 포함된 일반 JSON 파일이므로 안전한 곳에 보관해 주세요.')+'</p><div class="modal-actions">'+button('백업 파일 저장','export',null,'secondary')+button('백업 불러오기','import',null,'secondary')+(loadFailed?button('읽지 못한 원본 저장','export-raw',null,'secondary'):'')+(hasPreviousImport?button('복원 전 기록 파일로 저장','export-previous',null,'secondary'):'')+'</div>'+(hasPreviousImport?'<p>마지막 백업 복원 직전의 기록 1회분을 이 기기에 보관 중입니다. 필요한 경우 별도 파일로 저장해 주세요. 자동으로 다른 기기에 전달되지는 않습니다.</p>':'')+'</div><div class="settings-group"><h3>'+(kind==='market'?'지금 이용할 수 있는 기능':'현재 체험 범위')+'</h3><p>'+({'museum':'물건 보류, 전시, 구매 상태 변경과 기록을 체험할 수 있습니다. 전시 금액은 등록한 물건의 가격 합계이며 실제 저축액이 아닙니다.','laundry':'세탁 애니메이션과 개인 기록 보관을 체험할 수 있습니다. 걱정 내용은 서버나 AI 서비스로 전송하지 않습니다.','market':'할 일을 적고 완료하거나 취소할 수 있습니다. 완료 기록은 날짜별로 남고, 가게 불빛은 매일 자정에 새로 시작합니다.'}[kind])+' 결제 기능은 연결되어 있지 않습니다.</p></div>';
 if(update)$('#modal-content').innerHTML=html;else openModal('나의 작은 공간',html);
}
async function exportFile(raw,previous=false){
 let data;
 if(previous){
  try{data=localStorage.getItem(previousImportKey)}catch(_){toast('교체 전 기록을 읽을 수 없습니다.');return}
  if(!data){toast('내보낼 이전 기록이 없습니다.');return}
 }else if(raw){try{data=localStorage.getItem(key)||'null'}catch(_){toast('원본에 접근할 수 없습니다.');return}}
 else{if(loadFailed){toast('원본 보호 중에는 원본 저장을 이용해 주세요.');return}data=JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)}
 const filename=kind+'-backup-'+dayKey()+(previous?'-before-import':raw?'-raw':'')+'.json';
 if(window.Capacitor?.isNativePlatform?.()){
   const filesystem=window.Capacitor.Plugins?.Filesystem,share=window.Capacitor.Plugins?.Share;
   if(!filesystem||!share){toast('기기 백업 기능을 사용할 수 없습니다. 업데이트 후 다시 시도해 주세요.');return}
   try{
     const saved=await filesystem.writeFile({path:filename,data,directory:'CACHE',encoding:'utf8'});
     await share.share({title:'오늘도 문 열었습니다 기록 백업',text:'백업 파일을 안전한 곳에 보관해 주세요.',url:saved.uri,dialogTitle:'기록 백업 저장'});
     toast('백업 파일 공유 화면을 열었어요. 실제 저장 여부를 확인해 주세요.');
   }catch(err){toast('백업 내보내기를 완료하지 못했어요. '+(err.message||'다시 시도해 주세요.'))}
   return;
 }
 const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('백업 파일 저장을 요청했어요.');
}
let pendingImport=null;
async function importFile(e){
 const file=e.target.files[0];e.target.value='';if(!file)return;
 try{if(file.size>3000000)throw new Error('백업 파일은 3MB 이하만 열 수 있습니다.');pendingImport=validate(JSON.parse(await file.text()),kind);openModal('백업에서 복구할까요?','<p>이 앱의 기록 '+pendingImport.items.length+'개를 불러옵니다. 현재 기록 '+state.items.length+'개는 백업 내용으로 교체됩니다. 필요하면 먼저 현재 기록을 백업해 주세요.</p><div class="modal-actions">'+button('현재 기록 백업','export',null,'secondary')+button('복구하기','confirm-import',null,'primary')+button('취소','cancel',null,'secondary')+'</div>')}catch(err){pendingImport=null;toast('불러올 수 없어요. '+err.message)}
}
function shareSummary(){
 const m=metrics(kind,state.items);let text=kind==='museum'?'나의 안 산 물건 박물관\n사지 않기로 한 선택 '+m.count+'개를 모았어요.\n등록한 물건 금액: '+format(m.amount)+'원\n※ 실제 저축액이 아닌, 구매하지 않은 물건의 등록 금액입니다.':kind==='laundry'?'오늘의 마음을 걱정세탁소에 맡겼어요.\n차곡차곡 접어둔 마음 '+m.count+'장.': '오늘도 문 열었습니다\n오늘 끝낸 일 '+m.today+'개, 불 켜진 가게 '+m.lights+'곳.\n작은 실천이 나의 골목을 밝힙니다.';
 openModal('나의 기록 한 장','<p>개별 기록 내용은 넣지 않은 소개 문구입니다. 원하는 곳에 직접 복사해서 나눌 수 있어요.</p><textarea id="share-copy" class="share-text" readonly>'+esc(text)+'</textarea><div class="modal-actions">'+button('문구 복사','copy-share',null,'primary')+button('닫기','cancel',null,'secondary')+'</div>');
}
init();
// The system keyboard obscures fixed navigation on small WebViews. Keep the task input
// and its submit action readable while the text field is focused.
if(kind==='market'){
  const keepEntryActionVisible=()=>{
    const focused=document.activeElement?.matches?.('#entry-form input[name="text"]');
    if(!focused||window.innerWidth>640)return;
    const submit=$('#entry-form .primary');
    if(!submit)return;
    const bottom=window.visualViewport?.height??window.innerHeight;
    if(submit.getBoundingClientRect().bottom>bottom-12){
      submit.scrollIntoView({block:'end',behavior:'instant'});
    }
  };
  const focusState=()=>{
    const active=document.activeElement;
    const isEditing=active?.matches?.('#entry-form input[name="text"]');
    document.body.classList.toggle('entry-keyboard-focus',!!isEditing);
    if(isEditing)requestAnimationFrame(keepEntryActionVisible);
  };
  document.addEventListener('focusin',focusState);
  document.addEventListener('focusout',()=>queueMicrotask(focusState));
  window.visualViewport?.addEventListener('resize',()=>requestAnimationFrame(keepEntryActionVisible));
}
if(window.Capacitor?.isNativePlatform?.()){
  const nativeApp=window.Capacitor.Plugins?.App;
  let lastBackAt=0;
  nativeApp?.addListener('backButton',()=>{
    if($('#modal').open){closeModal();return}
    if($('#premium-store').open){$('#premium-store').close();return}
    if($('#street-theatre').open){$('#street-theatre').close();return}
    const active=document.activeElement;
    if(active?.matches?.('input,textarea,select,[contenteditable]')){
      active.blur();
      return;
    }
    if(view!=='home'){setView('home');return}
    const now=Date.now();
    if(now-lastBackAt<2200){
      lastBackAt=0;
      nativeApp.exitApp();
      return;
    }
    lastBackAt=now;
    toast('한 번 더 누르면 앱을 종료합니다.');
  });
}
// Optional offline app-shell. Insecure LAN HTTP keeps the previous online-only behavior.
if(!window.Capacitor?.isNativePlatform?.() && 'serviceWorker' in navigator && window.isSecureContext){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register(new URL('./sw.js',document.baseURI),{scope:'./'})
      .catch(err=>console.warn('오프라인 사용을 준비하지 못했습니다:',err.message));
  },{once:true});
}
