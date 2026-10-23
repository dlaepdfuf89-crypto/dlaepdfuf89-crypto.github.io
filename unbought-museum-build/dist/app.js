
import {empty,validate,makeRecord,transition,metrics,dayKey,GROUPS} from './model.js';
import {GALLERY_EXAMPLES,renderMuseumGallery} from './gallery.js';
import {renderFeaturedExhibit} from './hero-curator.js';
import {museumObject} from './artwork.js';
import {suggestMuseumGroup} from './museum-categories.js';
import {showroomTheme,showroomStage,showroomModal} from './showroom.js';
import {premiumOfferHTML,PREMIUM_PRODUCTS,COMMERCE_STATE} from './premium-offer.js';
import {makePostcardCanvas,downloadPostcard} from './postcard.js';
import {postcardModalHTML,purchaseInformationHTML} from './postcard-ui.js';
const kind=document.body.dataset.app, key='little-worlds.'+kind+'.v1';
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
const nav=['home','archive'];
let state=empty(kind),view='home',filter='all',loadFailed=false,toastTimer,lastDay=dayKey(),recentlyPlacedId=null,exhibitMomentTimer=null;
let deferredInstallPrompt=null,postcardCanvas=null,postcardRenderNonce=0;
async function renderPostcardPreview(themeId){
 const host=$('#postcard-preview-host');if(!host)return;
 const nonce=++postcardRenderNonce;postcardCanvas=null;
 host.textContent='나만의 전시 카드를 그리는 중입니다…';
 const save=$('#postcard-export');if(save)save.disabled=true;
 try{
  const canvas=await makePostcardCanvas({themeId,items:state.items});
  if(nonce!==postcardRenderNonce||!host.isConnected)return;
  canvas.setAttribute('aria-label','무료 미리보기 표시가 있는 나의 전시 카드');
  host.replaceChildren(canvas);postcardCanvas=canvas;
  if(save)save.disabled=false;
 }catch(err){if(nonce===postcardRenderNonce&&host.isConnected)host.textContent='전시 카드를 만들 수 없습니다. '+err.message}
}

window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;toast('앱 설치가 확인됐습니다.');});
try{const saved=localStorage.getItem(key);if(saved)state=validate(JSON.parse(saved),kind)}catch(e){loadFailed=true;$('#storage-warning').hidden=false;$('#storage-warning').textContent='저장된 기록을 읽을 수 없어 원본을 보호하고 있습니다. 설정에서 원본을 백업한 뒤 복구해 주세요. '+e.message}
function commit(next){
 if(loadFailed){toast('원본 보호 중입니다. 먼저 설정에서 백업 또는 복구해 주세요.');return false}
 try{next=validate(next,kind);localStorage.setItem(key,JSON.stringify(next));state=next;return true}
 catch(e){toast('저장하지 못했습니다. 기록은 변경되지 않았어요. '+e.message);return false}
}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('on'),4000)}
function presentSavedExhibition(item){
 if(kind!=='museum'||item?.status!=='exhibited')return;
 const moment=$('#gallery-moment'),gallery=$('#gallery-room');
 if(!moment||!gallery||moment.hidden)return;
 clearTimeout(toastTimer);$('#toast').classList.remove('on'); // The reward is inside the gallery, not over content.
 clearTimeout(exhibitMomentTimer);
 // Keep the message in the document flow instead of putting a pop-up over controls.
 requestAnimationFrame(()=>{
  if(view!=='home'||!gallery.isConnected)return;
  gallery.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 });
 const identifier=item.id;
 exhibitMomentTimer=setTimeout(()=>{
  if(moment.isConnected&&!moment.hidden&&state.items.some(x=>x.id===identifier&&x.status==='exhibited')){
   moment.hidden=true;
  }
 },7500);
}
function button(text,action,id,cls='quiet'){return '<button class="'+cls+'" data-action="'+action+'"'+(id?' data-id="'+esc(id)+'"':'')+'>'+text+'</button>'}
function setView(next){view=next;filter='all';render();window.scrollTo({top:0,behavior:'smooth'})}
function openModal(title,html){$('#modal-title').textContent=title;$('#modal-content').innerHTML=html;$('#modal').showModal()}
function closeModal(){postcardRenderNonce++;postcardCanvas=null;const modal=$('#modal');if(modal.open)modal.close();$('#modal-content').replaceChildren();pendingImport=null;}
function opts(kind){return GROUPS[kind].map(x=>'<option value="'+x+'">'+labels[kind][x]+'</option>').join('')}
let museumGroupChoice='auto';
const previewShapeNames=Object.freeze({classic:'기본 조형물',loafer:'로퍼',slipper:'슬리퍼',boot:'부츠',backpack:'백팩',suitcase:'여행가방',headphones:'헤드폰',camera:'카메라',laptop:'노트북',lamp:'조명',chair:'의자',tumbler:'텀블러',kettle:'주전자',book:'책',jewelry:'반지'});
function syncMuseumGroupFromName(){
 if(kind!=='museum'||museumGroupChoice==='manual')return;
 const form=$('#entry-form');if(!form)return;
 const name=form.elements.namedItem('text')?.value||'';
 const suggestion=suggestMuseumGroup(name);
 form.elements.namedItem('group').value=suggestion||'other';
}
function updateFormArtwork(){
 if(kind!=='museum')return;
 const form=$('#entry-form'),art=$('#form-art-preview'),caption=$('#form-art-caption');
 if(!form||!art||!caption)return;
 const name=form.elements.namedItem('text')?.value||'';
 const group=form.elements.namedItem('group')?.value||'shoes';
 // Unsaved first-visit example: show a recognizable camera instead of the
 // generic gift silhouette. No sample becomes a persisted record or amount.
 const isEmpty=!name.trim();
 art.innerHTML=isEmpty?museumObject('tech','','카메라'):museumObject(group,'',name);
 const shape=art.querySelector('svg')?.dataset.shape||'classic';
 caption.textContent=isEmpty?'카메라 · 예시':(previewShapeNames[shape]||'조형물')+' 형태';
 const hint=$('#museum-group-hint');
 if(hint){
  const suggestion=suggestMuseumGroup(name);
  hint.textContent=museumGroupChoice==='manual'?'직접 선택한 종류를 사용해요.':suggestion?labels.museum[suggestion]+' 자동 추천 · 변경 가능':'알맞은 전시 종류를 직접 선택해 주세요.';
  hint.dataset.source=museumGroupChoice==='manual'?'manual':suggestion?'suggested':'unknown';
 }
 const cta=$('#entry-cta-label');
 if(cta){
  const exhibit=form.elements.namedItem('exhibit')?.checked;
  const wait=form.elements.namedItem('waitDays')?.value;
  cta.textContent=exhibit?'내 전시실에 놓기':wait==='3'?'3일 동안 생각하기':wait==='7'?'일주일 기다려보기':'하루 동안 맡겨두기';
 }
}
function init(){
 document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
 $('#today-label').textContent=new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});
 if(kind==='museum')$('#entry-form').innerHTML='<label class="field fullfield"><span>물건 이름</span><input name="text" required maxlength="80" placeholder="예: 눈여겨보던 운동화" autocomplete="off"></label><div class="field-row"><label class="field"><span>가격 · 원</span><input name="amount" required type="number" min="1" max="1000000000" step="1" inputmode="numeric" placeholder="129000"></label><label class="field"><span>전시 종류</span><select name="group" aria-describedby="museum-group-hint">'+opts(kind)+'</select><small class="museum-group-hint" id="museum-group-hint" aria-live="polite"></small></label></div><label class="field fullfield"><span>생각할 시간</span><select name="waitDays"><option value="1">하루만 기다려볼게요</option><option value="3">3일 동안 생각할게요</option><option value="7">일주일 뒤에 다시 볼게요</option></select></label><label class="check"><input name="exhibit" type="checkbox">이미 사지 않기로 했어요 · 바로 전시하기</label><button class="primary wide" type="submit">'+icon('plus')+'<span id="entry-cta-label">하루 동안 맡겨두기</span></button>';
 if(kind==='laundry')$('#entry-form').innerHTML='<label class="field fullfield"><span>지금 마음에 남은 한 줄</span><textarea name="text" required maxlength="400" placeholder="내일 해야 할 일이 자꾸 생각나요…" rows="3"></textarea></label><label class="field fullfield"><span>오늘의 마음</span><select name="group">'+opts(kind)+'</select></label><button class="primary wide" type="submit">'+icon('laundry')+'세탁 맡기기</button><p class="form-note">'+icon('lock')+'내용은 펼쳐볼 때만 화면에 나타나요</p>';
 if(kind==='market')$('#entry-form').innerHTML='<label class="field fullfield"><span>현실에서 할 작은 일</span><input name="text" required maxlength="80" placeholder="예: 책상 위 5분만 정리하기" autocomplete="off"></label><label class="field fullfield"><span>이 일을 끝내면 열릴 가게</span><select name="group">'+opts(kind)+'</select></label><p class="sub fullfield">끝낸 일에 체크하면 가게에 불이 켜져요.<br>하루에 여섯 가게를 밝힐 수 있어요.</p><button class="primary wide" type="submit">'+icon('plus')+'오늘의 할 일 적기</button>';
 $('#entry-form').insertAdjacentHTML('beforeend','<p class="error fullfield" id="form-error" role="alert"></p>');
 if(kind==='museum'){
  $('#entry-form').addEventListener('input',e=>{if(e.target.name==='text'){syncMuseumGroupFromName();updateFormArtwork()}});
  $('#entry-form').addEventListener('change',e=>{if(e.target.name==='group')museumGroupChoice='manual';if(['group','waitDays','exhibit'].includes(e.target.name))updateFormArtwork()});
  syncMuseumGroupFromName();updateFormArtwork();
 }
 $('#entry-form').addEventListener('submit',e=>{
  e.preventDefault();$('#form-error').textContent='';
  const data=Object.fromEntries(new FormData(e.target));data.exhibit=data.exhibit==='on';
  try{const item=makeRecord(kind,data);if(commit({...state,items:[item,...state.items]})){recentlyPlacedId=kind==='museum'&&item.status==='exhibited'?item.id:null;e.target.reset();museumGroupChoice='auto';syncMuseumGroupFromName();updateFormArtwork();render();presentSavedExhibition(item);if(kind!=='museum'||item.status!=='exhibited')toast(kind==='museum'?'물건을 맡겼어요. 천천히 결정해 보세요.':kind==='laundry'?'마음을 맡겼어요. 8초 동안 잠시 쉬어가세요.':'할 일을 적었어요. 끝내면 가게를 열어주세요.')}}catch(err){$('#form-error').textContent=err.message}
 });
 $('#modal-close').addEventListener('click',closeModal);
 $('#modal').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
 $('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-view],[data-action],[data-filter]');if(!b)return;if(b.dataset.view){setView(b.dataset.view);return}if(b.dataset.filter){filter=b.dataset.filter;render();return}handle(b.dataset.action,b.dataset.id)});
 $('#import-file').addEventListener('change',importFile);
 $('#modal').addEventListener('change',e=>{
  if(e.target?.id==='confirm-replace'){
   const go=$('#modal [data-action="confirm-import"]');
   if(go)go.disabled=!e.target.checked;
  }
 });
 window.addEventListener('storage',e=>{if(e.key===key){try{state=e.newValue?validate(JSON.parse(e.newValue),kind):empty(kind);loadFailed=false;$('#storage-warning').hidden=true;render()}catch(_){toast('다른 창의 기록을 읽지 못했습니다. 새로고침 후 확인해 주세요.')}}});
 render();setInterval(tick,1000);
}
function render(){
 document.body.dataset.theme=state.theme;
 $('#home-section').hidden=view!=='home';$('#archive-heading').hidden=view!=='archive';
 document.querySelectorAll('[data-view]').forEach(e=>{e.classList.toggle('active',e.dataset.view===view);e.setAttribute('aria-current',e.dataset.view===view?'page':'false')});
 const m=metrics(kind,state.items),values=kind==='museum'?[[format(m.amount),'원','전시한 물건의 등록 금액'],[m.count,'점','나의 전시품'],[m.waiting,'개','생각 중인 물건']]:kind==='laundry'?[[m.count,'장','접어둔 마음'],[m.working,'장','세탁 중인 마음'],[m.total,'번','나에게 건넨 시간']]:[[m.today,'개','오늘 끝낸 일'],[m.lights+'/6','곳','오늘 켠 가게'],[m.days,'일','불을 켰던 날']];
 $('#metrics').innerHTML=values.map(x=>'<div class="metric"><span class="metric-label">'+x[2]+'</span><strong>'+x[0]+'</strong><em>'+x[1]+'</em></div>').join('');
 $('#hero-state').innerHTML=icon(kind==='market'?'spark':kind)+'<span>'+(kind==='museum'?'나의 전시품 '+m.count+'점':kind==='laundry'?m.working>0?'마음 '+m.working+'장 세탁 중':'오늘도 따뜻하게 영업 중':'오늘 '+m.lights+'개의 가게가 켜졌어요')+'</span>';
 if(kind==='museum'){renderMuseumGallery({items:state.items,icon,esc,format,recentlyPlacedId});renderFeaturedExhibit({items:state.items,esc,format});recentlyPlacedId=null;const offer=$('#premium-offer-root');if(offer)offer.innerHTML=premiumOfferHTML({exhibitCount:m.count,esc});}
 $('#record-title').textContent=kind==='museum'?(view==='home'?'내 선택이 머무는 곳':'나의 소장 기록'):kind==='laundry'?(view==='home'?'오늘 맡긴 마음':'차곡차곡 접어둔 마음'):(view==='home'?'오늘의 작은 실천':'골목이 밝아진 기록');
 $('#record-subtitle').textContent=kind==='museum'?'천천히 결정해도 괜찮아요':kind==='laundry'?'읽고 싶을 때만 펼쳐보세요':'작은 일도 충분히 멋진 일이에요';
 const options=kind==='museum'?(view==='home'?[['all','모두'],['waiting','생각 중'],['exhibited','전시 중']]:[['all','모두'],['exhibited','전시품'],['purchased','구매한 물건']]):kind==='market'&&view==='home'?[['all','모두'],['open','할 일'],['done','오늘 완료']]:[];
 $('#filters').innerHTML=options.map(x=>'<button class="pill '+(filter===x[0]?'active':'')+'" data-filter="'+x[0]+'" aria-pressed="'+(filter===x[0])+'">'+x[1]+'</button>').join('');
 let items=state.items.filter(x=>kind==='museum'?(view==='archive'?x.status!=='waiting':x.status!=='purchased'):kind==='laundry'?(view==='archive'?x.status==='folded':x.status!=='folded'):(view==='archive'?x.status==='done':x.status==='open'||dayKey(x.doneAt)===dayKey()));
 if(filter!=='all')items=items.filter(x=>x.status===filter);
 if(view==='archive')items.sort((a,b)=>(b.doneAt||b.createdAt)-(a.doneAt||a.createdAt));
 $('#records').classList.toggle('market-records',kind==='market');
 if(kind==='museum')$('#records').dataset.density=items.length===1?'one':items.length===2?'two':'many';
 $('#records').innerHTML=items.length?items.map(recordCard).join(''):'<div class="empty"><div class="empty-icon">'+icon(kind==='laundry'?'heart':kind)+'</div><h3>'+(view==='home'?CONFIG.empty:'아직 보관된 기록이 없어요.')+'</h3><p>'+(view==='home'?CONFIG.emptysub:kind==='laundry'?'세탁이 끝난 마음을 걷어 보관해 보세요.':kind==='market'?'현실에서 끝낸 일에 체크하면 영업 일지가 쌓여요.':'사지 않기로 한 물건이 여기에 모여요.')+'</p></div>';
 if(kind==='laundry')$('.hero').classList.toggle('doing-laundry',state.items.some(x=>x.status==='washing'));
 if(kind==='market'){
  const lit=new Set(state.items.filter(x=>x.status==='done'&&dayKey(x.doneAt)===dayKey()).map(x=>x.group));
  $('#shops').innerHTML=GROUPS.market.map(x=>'<div class="shop '+(lit.has(x)?'lit':'')+'" aria-label="'+labels.market[x]+(lit.has(x)?' 영업 중':' 아직 불이 꺼져 있어요')+'">'+icon(x)+'<span>'+labels.market[x]+'</span></div>').join('');
  $('#market-glow').classList.toggle('glow',lit.size>0);
  document.querySelectorAll('[data-shop-light]').forEach(e=>e.classList.toggle('on',lit.has(e.dataset.shopLight)));
 }tickLabels();
}
function recordCard(x){
 if(kind==='museum'){
  const tag=x.status==='waiting'?'생각 중':x.status==='exhibited'?'소장 완료':'구매한 물건';
  return '<article class="record record-museum record-status-'+esc(x.status)+'" data-record-id="'+esc(x.id)+'"><span class="record-tag">'+tag+'</span><div class="record-museum-scene"><span class="record-museum-lamp" aria-hidden="true"></span><div class="record-museum-object">'+museumObject(x.group,x.id,x.text)+'</div><div class="record-museum-plinth" aria-hidden="true"></div></div><div class="record-body"><span class="record-meta">'+labels.museum[x.group]+' · '+date(x.createdAt)+'</span><h3>'+esc(x.text)+'</h3><div class="money">'+format(x.amount)+'<span style="font-size:11px"> 원</span></div>'+(x.status==='waiting'?'<span class="record-meta" data-ready="'+x.readyAt+'"></span>':'<span class="record-meta">'+(x.status==='exhibited'?'사지 않은 나의 선택':'구매하지 않은 금액에서 제외됩니다')+'</span>')+'<div class="record-actions">'+(x.status==='waiting'?button('전시하기','exhibit',x.id)+button('구매했어요','purchase',x.id,'secondary'):x.status==='exhibited'?button('다시 생각하기','reconsider',x.id,'secondary')+button('구매했어요','purchase',x.id,'secondary'):button('다시 생각하기','reconsider',x.id,'secondary'))+button('삭제','ask-delete',x.id,'link-button')+'</div></div></article>';
 }
 if(kind==='laundry'){
  const tag=x.status==='washing'?'세탁 중':x.status==='drying'?'바람에 말리는 중':'보관 완료';
  return '<article class="record '+x.status+'"><span class="record-tag">'+tag+'</span><div class="cloth-scene">'+(x.status==='folded'?'':'<div class="clothesline"></div>')+'<div class="cloth">'+icon('heart')+'</div></div><div class="record-body"><span class="record-meta">'+date(x.createdAt)+'의 마음</span><h3>'+labels.laundry[x.group]+'</h3>'+(x.status==='washing'?'<span class="countdown" data-wash="'+x.readyAt+'">마음을 세탁하고 있어요</span><div class="ritual-progress"><span data-progress="'+x.readyAt+'"></span></div>':'<span class="record-meta">'+(x.status==='drying'?'잠시 내려놓은 마음을 접어둘까요?':'필요할 때 다시 펼쳐보세요.')+'</span>')+'<div class="record-actions">'+(x.status==='drying'?button('빨래 걷기','fold',x.id):'')+button('펼쳐보기','read',x.id,'secondary')+button('삭제','ask-delete',x.id,'link-button')+'</div></div></article>';
 }
 return '<article class="record '+(x.status==='done'?'task-done':'')+'"><div class="record-body"><div class="task-line"><button class="task-check '+(x.status==='done'?'done':'')+'" data-action="'+(x.status==='done'?'undo':'complete')+'" data-id="'+x.id+'" aria-label="'+esc(x.text)+(x.status==='done'?' 완료 취소':' 완료하기')+'">'+(x.status==='done'?icon('check'):'')+'</button><div class="task-copy"><span class="shop-tag">'+icon(x.group)+labels.market[x.group]+'</span><h3>'+esc(x.text)+'</h3><span class="record-meta">'+(x.status==='done'?date(x.doneAt)+' · 가게에 불을 켰어요':date(x.createdAt)+'에 적은 일')+'</span><div class="record-actions">'+button('삭제','ask-delete',x.id,'link-button')+'</div></div></div></div></article>';
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
 if(kind==='museum'&&action==='postcard-open'){
  if(!state.items.some(item=>item.status==='exhibited')){
   if($('#modal').open)closeModal();
   if(view!=='home')setView('home');
   $('#entry-form').scrollIntoView({behavior:'smooth',block:'center'});
   toast('실제 전시품을 하나 등록하면 나의 전시 카드를 만들 수 있어요.');return;
  }
  if($('#modal').open)closeModal();
  openModal('나의 전시 카드 만들기',postcardModalHTML('atelier'));
  renderPostcardPreview('atelier');return;
 }
 if(kind==='museum'&&action==='postcard-theme'){
  if(!$('#modal').open||!$('#postcard-preview-host'))return;
  const current=showroomTheme(id);
  document.querySelectorAll('.postcard-theme').forEach(b=>{b.classList.toggle('selected',b.dataset.id===current.id);b.setAttribute('aria-pressed',String(b.dataset.id===current.id))});
  renderPostcardPreview(current.id);return;
 }
 if(kind==='museum'&&action==='postcard-export'){
  if(!postcardCanvas){toast('카드 이미지가 아직 준비되지 않았어요.');return}
  downloadPostcard(postcardCanvas).then(mode=>toast(mode==='native-picker'?'이미지 저장 위치를 선택해 주세요.':'무료 미리보기 이미지 저장을 요청했어요.')).catch(err=>toast('이미지 저장에 실패했습니다. '+err.message));return;
 }
 if(kind==='museum'&&action==='premium-info'){
  if($('#modal').open)closeModal();
  openModal('프리미엄 상품 안내 · 출시 준비 중',purchaseInformationHTML());return;
 }

 if(kind==='museum'&&action==='showroom-open'){
  if($('#modal').open)closeModal();
  openModal('특별 전시실 · 디자인 미리보기',showroomModal({themeId:'atelier',items:state.items,icon,esc,format}));
  return;
 }
 if(kind==='museum'&&action==='showroom-theme'){
  if(!$('#modal').open||!$('#showroom-stage'))return;
  const chosen=showroomTheme(id);
  $('#showroom-stage').innerHTML=showroomStage({themeId:chosen.id,items:state.items,icon,esc,format});
  document.querySelectorAll('.showroom-variant').forEach(b=>{
   const active=b.dataset.id===chosen.id;
   b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));
  });
  return;
 }
 if(action==='install-app'){
  if(!deferredInstallPrompt){toast('브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택해 주세요.');return}
  const prompt=deferredInstallPrompt;deferredInstallPrompt=null;
  prompt.prompt();
  prompt.userChoice.then(choice=>{if(choice.outcome==='accepted')toast('설치 요청을 받았습니다.');else toast('설치를 취소했습니다.');});
  return;
 }
 if(kind==='museum'&&action==='focus-form'){
  if($('#modal').open)closeModal();
  if(view!=='home')setView('home');
  const form=$('#entry-form');
  form.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  form.elements.namedItem('text').focus({preventScroll:true});
  return;
 }
 if(action==='settings'){settings();return}
 if(action==='theme-default'||action==='theme-alternate'){if(commit({...state,theme:action==='theme-default'?'default':'alternate'})){render();settings(true)}return}
 if(action==='export'){exportFile(false);return}
 if(kind==='museum'&&action==='export-text'){
  if(loadFailed){toast('기존 기록을 읽지 못했습니다. 먼저 원본 저장을 이용해 주세요.');return}
  const data=JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2);
  openModal('백업 JSON 텍스트 보관하기',
   '<p>아래 내용에는 물건 이름과 가격 등 개인 기록이 포함됩니다. 안전한 개인 공간에 보관해 주세요. 서버에는 전송하지 않습니다.</p>'+
   '<label class="backup-paste-label" for="backup-copy-input">나의 전체 백업 JSON</label>'+
   '<textarea id="backup-copy-input" class="backup-paste" rows="6" readonly spellcheck="false">'+esc(data)+'</textarea>'+
   '<p class="backup-paste-hint">다른 기기에서는 ‘JSON 텍스트 붙여넣기’ 메뉴에 붙여넣어 복구할 수 있습니다.</p>'+
   '<div class="modal-actions">'+button('전체 선택·복사','copy-backup-text',null,'primary')+button('닫기','cancel',null,'secondary')+'</div>');
  return;
 }
 if(kind==='museum'&&action==='copy-backup-text'){
  const control=$('#backup-copy-input');if(!control)return;
  control.focus();control.select();
  if(navigator.clipboard?.writeText){navigator.clipboard.writeText(control.value).then(()=>toast('백업 JSON을 복사했어요. 다른 사람이 볼 수 없는 곳에 보관해 주세요.')).catch(()=>toast('복사가 차단됐습니다. 선택된 전체 내용을 직접 복사해 주세요.'));}
  else toast('전체 내용이 선택됐습니다. 복사 메뉴를 사용해 주세요.');
  return;
 }
 if(action==='export-raw'){exportFile(true);return}
 if(action==='import'){closeModal();$('#import-file').click();return}
 if(kind==='museum'&&action==='import-text'){
  pendingImport=null;
  openModal('백업 JSON 텍스트 가져오기',
   '<p>다른 기기의 백업 파일 내용을 그대로 복사해 아래에 붙여넣으세요. 내용은 서버로 전송되지 않고 이 기기에서만 검증됩니다.</p>'+
   '<label class="backup-paste-label" for="backup-paste-input">백업 JSON</label>'+
   '<textarea id="backup-paste-input" class="backup-paste" rows="6" maxlength="3000000" spellcheck="false" autocomplete="off" placeholder="{\u0022app\u0022:\u0022museum\u0022, ...}"></textarea>'+
   '<p class="backup-paste-hint">최대 3MB · 기존 기록은 내용을 확인하고 동의하기 전까지 변경되지 않습니다.</p>'+
   '<div class="modal-actions">'+button('내용 확인하기','preview-import-text',null,'primary')+button('취소','cancel',null,'secondary')+'</div>');
  return;
 }
 if(kind==='museum'&&action==='preview-import-text'){
  try{
   const raw=$('#backup-paste-input')?.value||'';
   if(!raw.trim())throw new Error('백업 JSON을 붙여넣어 주세요.');
   if(new TextEncoder().encode(raw).length>3000000)throw new Error('백업 내용은 3MB 이하만 가져올 수 있습니다.');
   const candidate=validate(JSON.parse(raw),kind);
   showImportPreview(candidate);
  }catch(err){toast('백업을 확인할 수 없어요. '+err.message)}
  return;
 }
 if(action==='share'){shareSummary();return}
 if(action==='copy-share'){if(!navigator.clipboard){toast('문구를 길게 눌러 복사해 주세요.');return}navigator.clipboard.writeText($('#share-copy').value).then(()=>toast('소개 문구를 복사했어요.')).catch(()=>toast('문구를 길게 눌러 복사해 주세요.'));return}
 if(action==='cancel'){pendingImport=null;closeModal();return}
 if(action==='confirm-import'){
  const verified=$('#modal #confirm-replace');
  if(!pendingImport||!verified?.checked){toast('기록 교체 내용을 확인해 주세요.');return}
  try{const restored=pendingImport;localStorage.setItem(key,JSON.stringify(restored));state=restored;pendingImport=null;loadFailed=false;$('#storage-warning').hidden=true;closeModal();render();toast('백업에서 기록을 복구했어요.')}
  catch(e){toast('복구하지 못했습니다. 현재 기록은 유지됩니다.')}
  return;
 }
 if(kind==='museum'&&action==='sample-prefill'){
  const sample=GALLERY_EXAMPLES[Number(id)];if(!sample)return;
  setView('home');const form=$('#entry-form');
  form.elements.namedItem('text').value=sample.text;
  form.elements.namedItem('amount').value=sample.amount;
  form.elements.namedItem('group').value=sample.group;
  form.elements.namedItem('waitDays').value='1';
  form.elements.namedItem('exhibit').checked=true;
  museumGroupChoice='auto';
  updateFormArtwork();
  form.scrollIntoView({behavior:'smooth',block:'center'});
  form.elements.namedItem('text').focus({preventScroll:true});
  toast('예시가 입력란에만 채워졌습니다. 내용을 확인하고 등록해야 실제 전시됩니다.');return;
 }
 if(kind==='museum'&&action==='focus-records'){
  document.getElementById('records').scrollIntoView({behavior:'smooth',block:'start'});
  return;
 }
 if(kind==='museum'&&action==='focus-exhibit'){
  if(!state.items.some(x=>x.id===id&&x.status==='exhibited'))return;
  if(view!=='home'||filter!=='all')setView('home');
  const card=Array.from(document.querySelectorAll('[data-record-id]')).find(x=>x.dataset.recordId===id);
  if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.classList.add('gallery-focus');setTimeout(()=>card.classList.remove('gallery-focus'),1800)}
  return;
 }
 const item=state.items.find(x=>x.id===id);if(!item)return;
 if(action==='ask-delete'){openModal('이 기록을 지울까요?','<p>선택한 기록 한 개를 삭제합니다. 삭제한 기록은 백업 파일이 있어야 복구할 수 있어요.</p><div class="modal-actions">'+button('삭제하기','delete',id,'primary')+button('취소','cancel',null,'secondary')+'</div>');return}
 if(action==='delete'){if(commit({...state,items:state.items.filter(x=>x.id!==id)})){closeModal();render();toast('선택한 기록을 삭제했어요.')}return}
 if(action==='read'){openModal(date(item.createdAt)+'에 맡긴 마음','<div class="note-text">'+esc(item.text)+'</div><p>'+labels.laundry[item.group]+' · 이 내용은 이 브라우저에만 보관됩니다.</p><div class="modal-actions">'+(item.status==='folded'?button('다시 세탁하기','rewash',id,'quiet'):'')+button('접어두기','cancel',null,'secondary')+'</div>');return}
 try{const next=transition(kind,item,action);if(commit({...state,items:state.items.map(x=>x.id===id?next:x)})){if(kind==='museum'&&action==='exhibit')recentlyPlacedId=id;if($('#modal').open)closeModal();render();if(kind==='museum'&&action==='exhibit')presentSavedExhibition(next);if(kind==='market'&&action==='complete'){toast(labels.market[item.group]+'에 불을 켰어요. 오늘도 한 걸음.');$('#shops').classList.remove('celebrate');void $('#shops').offsetWidth;$('#shops').classList.add('celebrate')}else if(kind==='museum'&&action==='exhibit'){/* The inline gallery ceremony replaces a redundant toast. */}else if(kind==='laundry'&&action==='fold')toast('마음을 곱게 접어 보관했어요.');else toast('기록을 바꿨어요.')}}catch(e){toast(e.message)}
}
function settings(update=false){
 const themeLabels=kind==='museum'?['오후의 전시실','초록 정원']:kind==='laundry'?['보랏빛 밤','복숭아빛 저녁']:['달빛 골목','자줏빛 밤'];
 const html='<p>이 앱은 첫 시제품입니다. 현재 제공되는 기능과 두 가지 화면 분위기는 무료로 체험할 수 있습니다.</p><div class="settings-group"><h3>나의 화면 분위기</h3><div class="theme-options">'+themeLabels.map((x,i)=>'<button class="theme-option '+(state.theme===(i?'alternate':'default')?'selected':'')+'" data-action="theme-'+(i?'alternate':'default')+'" aria-pressed="'+(state.theme===(i?'alternate':'default'))+'">'+x+'</button>').join('')+'</div></div><div class="settings-group"><h3>기기에 설치</h3><p>지원하는 브라우저라면 앱처럼 설치해 사용할 수 있습니다. 설치 후에도 이 기기의 기록은 자동 동기화되지 않습니다. 휴대전화에서는 HTTPS 체험 주소가 준비된 뒤 브라우저 메뉴의 앱 설치 또는 홈 화면에 추가를 사용해 주세요.</p><div class="modal-actions">'+button('이 기기에 앱 설치','install-app',null,'secondary')+'</div></div><div class="settings-group"><h3>기록과 백업</h3><p>이 기기에 웹앱으로 설치하거나 한 번 접속한 뒤에는 오프라인에서도 기록을 이어갈 수 있습니다. 단, 기기의 브라우저 데이터나 앱 저장 공간을 지우면 기록이 사라질 수 있습니다.</p><p>기록은 현재 기기의 이 브라우저에 저장됩니다. 다른 기기와 자동 동기화되지 않으며, 브라우저 데이터를 지우면 사라질 수 있습니다. 백업 파일은 내용이 포함된 일반 JSON 파일이므로 안전한 곳에 보관해 주세요.</p><div class="modal-actions">'+button('백업 파일 저장','export',null,'secondary')+button('백업 불러오기','import',null,'secondary')+(kind==='museum'?button('JSON 텍스트 내보내기','export-text',null,'secondary')+button('JSON 텍스트 붙여넣기','import-text',null,'secondary'):'')+(loadFailed?button('읽지 못한 원본 저장','export-raw',null,'secondary'):'')+'</div></div><div class="settings-group"><h3>현재 체험 범위</h3><p>'+({'museum':'물건 보류, 전시, 구매 상태 변경과 기록을 체험할 수 있습니다. 전시 금액은 등록한 물건의 가격 합계이며 실제 저축액이 아닙니다.','laundry':'세탁 애니메이션과 개인 기록 보관을 체험할 수 있습니다. 걱정 내용은 서버나 AI 서비스로 전송하지 않습니다.','market':'할 일 추가, 완료와 취소, 날짜별 기록과 가게 점등을 체험할 수 있습니다. 완료한 일은 날짜별로 남고 오늘의 가게 점등은 매일 새로 시작합니다.'}[kind])+' 결제 기능은 연결되어 있지 않습니다.</p></div>';
 if(update)$('#modal-content').innerHTML=html;else openModal('나의 작은 공간',html);
}
function exportFile(raw){
 let data;if(raw){try{data=localStorage.getItem(key)||'null'}catch(_){toast('원본에 접근할 수 없습니다.');return}}else{if(loadFailed){toast('원본 보호 중에는 원본 저장을 이용해 주세요.');return}data=JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)}
 const filename=kind+'-backup-'+dayKey()+(raw?'-raw':'')+'.json';
 if(kind==='museum'&&window.AndroidMuseum?.saveBackup){
  window.AndroidMuseum.saveBackup(filename,data);
  toast('백업 저장 위치를 선택해 주세요.');
  return;
 }
 const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('백업 파일 저장을 요청했어요.');
}
let pendingImport=null;
function showImportPreview(candidate){
 if($('#modal').open)closeModal();
 pendingImport=candidate;
 const oldCount=state.items.length,newCount=candidate.items.length;
 const oldM=kind==='museum'?metrics(kind,state.items):null;
 const newM=kind==='museum'?metrics(kind,candidate.items):null;
 const amounts=oldM?'<p class="restore-summary">현재 전시품 등록 금액: <strong>'+format(oldM.amount)+'원</strong> → 복구 후: <strong>'+format(newM.amount)+'원</strong></p>':'';
 openModal('백업 내용을 확인해 주세요',
  '<p class="restore-warning">현재 기록 '+format(oldCount)+'개가 백업 내용의 기록 '+format(newCount)+'개로 <strong>전체 교체</strong>됩니다. 자동으로 합쳐지지 않습니다.</p>'+
  amounts+
  '<p>기존 기록을 보존하려면 먼저 아래 백업 버튼으로 현재 기록을 저장하세요. 복구하기 전까지 이 기기의 기록은 변경되지 않습니다.</p>'+
  '<label class="restore-confirm"><input id="confirm-replace" type="checkbox"><span>현재 기록이 백업 내용으로 교체되는 것을 확인했습니다.</span></label>'+
  '<div class="modal-actions">'+button('현재 기록 백업','export',null,'secondary')+
  '<button type="button" class="primary" data-action="confirm-import" disabled>확인 후 복구하기</button>'+
  button('취소','cancel',null,'secondary')+'</div>');
}
async function importFile(e){
 const file=e.target.files[0];e.target.value='';if(!file)return;
 try{
  if(file.size>3000000)throw new Error('백업 파일은 3MB 이하만 열 수 있습니다.');
  const candidate=validate(JSON.parse(await file.text()),kind);
  showImportPreview(candidate);
 }catch(err){pendingImport=null;toast('불러올 수 없어요. '+err.message)}
}
function shareSummary(){
 const m=metrics(kind,state.items);let text=kind==='museum'?'나의 안 산 물건 박물관\n사지 않기로 한 선택 '+m.count+'개를 모았어요.\n등록한 물건 금액: '+format(m.amount)+'원\n※ 실제 저축액이 아닌, 구매하지 않은 물건의 등록 금액입니다.':kind==='laundry'?'오늘의 마음을 걱정세탁소에 맡겼어요.\n차곡차곡 접어둔 마음 '+m.count+'장.': '오늘도 문 열었습니다\n오늘 끝낸 일 '+m.today+'개, 불 켜진 가게 '+m.lights+'곳.\n작은 실천이 나의 골목을 밝힙니다.';
 openModal('나의 기록 한 장','<p>개별 기록 내용은 넣지 않은 소개 문구입니다. 원하는 곳에 직접 복사해서 나눌 수 있어요.</p><textarea id="share-copy" class="share-text" readonly>'+esc(text)+'</textarea><div class="modal-actions">'+button('문구 복사','copy-share',null,'primary')+button('닫기','cancel',null,'secondary')+'</div>');
}
init();
function updateOfflineIndicator(){
 const notice=$('#offline-indicator');
 if(notice)notice.hidden=navigator.onLine;
}
window.addEventListener('online',updateOfflineIndicator);
window.addEventListener('offline',updateOfflineIndicator);
updateOfflineIndicator();
// Cache only the public app shell. No user data is sent or cached by the worker.
if(!window.AndroidMuseum && !document.querySelector('meta[name="app-shell"][content="toss"]') && 'serviceWorker' in navigator && (
 location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname)
)){
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('./sw.js',{scope:'./'})
   .catch(err=>console.warn('오프라인 준비 실패:',err.message));
 },{once:true});
}
