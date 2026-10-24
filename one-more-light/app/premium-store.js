import {PRODUCT_CATALOG,SCENES,SALES_READY,formattedPrice,validateCatalog} from './premium-catalog.js';
validateCatalog();
const store=document.querySelector('#premium-store');
const container=document.querySelector('#store-product-list');
const sceneList=document.querySelector('#store-scene-picker');
const pickImage=document.querySelector('#store-scene-image');
const stageTitle=document.querySelector('#store-stage-title');
const stageNote=document.querySelector('#store-stage-description');
const overline=document.querySelector('#store-stage-overline');
let selection='moonlight';
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const productOf=scene=>PRODUCT_CATALOG.find(p=>p.id===SCENES[scene]?.sku);
function displayScene(scene){
 if(!Object.hasOwn(SCENES,scene))return;
 selection=scene;
 const item=SCENES[scene],product=productOf(scene);
 pickImage.src='assets/premium/'+scene+'.webp';
 pickImage.alt=item.name+' 원본 골목 기반 테마 미리보기';
 stageTitle.textContent=item.name;
 stageNote.textContent=item.note;
 overline.textContent=product.tag;
 store.dataset.preview=scene;
 container.querySelectorAll('[data-product]').forEach(button=>{
  const selected=button.dataset.product===product.id;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
 sceneList.querySelectorAll('[data-scene]').forEach(button=>{
  const selected=button.dataset.scene===scene;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
}
function renderStore(){
 container.innerHTML=PRODUCT_CATALOG.map((p,index)=>{
  const preview=p.scenes[0];
  return '<button type="button" class="store-product" data-product="'+p.id+'" aria-pressed="false">'
   +'<span class="store-product-picture"><img src="assets/premium/'+preview+'.webp" loading="lazy" alt=""><span class="store-product-index">0'+(index+1)+'</span></span>'
   +'<span class="store-product-copy"><span class="store-product-tag">'+escapeHtml(p.tag)+'</span><strong>'+escapeHtml(p.name)+'</strong><span class="store-product-subtitle">'+escapeHtml(p.description)+'</span><span class="store-product-bottom"><em>'+formattedPrice(p.priceKRW)+' · 가격 가안</em><span>미리보기 ↗</span></span></span>'
   +'</button>';
 }).join('');
 sceneList.innerHTML=Object.entries(SCENES).map(([id,s])=>
  '<button type="button" data-scene="'+id+'" class="store-scene-choice" aria-pressed="false">'+escapeHtml(s.name)+'</button>'
 ).join('');
 displayScene(selection);
}
function showStore(){
 if(!store||SALES_READY)return;
 if(document.querySelector('#modal')?.open||document.querySelector('#street-theatre')?.open)return;
 renderStore();
 store.showModal();
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-premium-open]')){showStore();return}
 const button=event.target.closest('[data-product],[data-scene]');
 if(!button||!store.open)return;
 if(button.dataset.product){
  const p=PRODUCT_CATALOG.find(p=>p.id===button.dataset.product);
  if(p)displayScene(p.scenes[0]);
 }else if(button.dataset.scene)displayScene(button.dataset.scene);
});
document.querySelector('#store-close')?.addEventListener('click',()=>store.close());
store?.addEventListener('click',event=>{
 if(event.target!==store)return;
 const box=store.getBoundingClientRect();
 if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)store.close();
});
// There are deliberately NO buy actions, entitlement flags, trial grants or
// payment SDK requests here. A visual preview cannot become a purchased product.
