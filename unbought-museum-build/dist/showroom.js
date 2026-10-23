import {selectExhibits,GALLERY_EXAMPLES} from './gallery.js';
import {museumObject} from './artwork.js';

/**
 * All premium concepts are presentation-only.
 * No purchase flag, SKU, price, analytics, or persistent entitlement exists.
 */
export const SHOWROOM_THEMES=Object.freeze([
  Object.freeze({id:'atelier',name:'오후의 석고 회랑',subtitle:'따뜻한 상아빛 아치와 금빛 햇살',label:'THE IVORY ATELIER'}),
  Object.freeze({id:'midnight',name:'자정의 유리정원',subtitle:'청록빛 유리와 고요한 별빛',label:'THE GLASS GARDEN'}),
  Object.freeze({id:'amber',name:'황혼의 소장실',subtitle:'호박색 조명과 짙은 월넛 선반',label:'THE AMBER SALON'})
]);
export function showroomTheme(id){
 return SHOWROOM_THEMES.find(x=>x.id===id)||SHOWROOM_THEMES[0];
}
export function showroomItems(items){
 const actual=selectExhibits(items,3);
 return {demo:actual.length===0,items:actual.length?actual:GALLERY_EXAMPLES.slice(0,3)};
}
export function showroomStage({themeId,items,icon,esc,format}){
 const theme=showroomTheme(themeId),collection=showroomItems(items);
 const fig=collection.items.map((item,index)=>
 '<div class="showroom-artwork showroom-artwork-'+esc(item.group)+'">'+
 '<span class="showroom-spotlight" aria-hidden="true"></span>'+
 '<span class="showroom-figure" aria-hidden="true">'+museumObject(item.group,collection.demo?'':item.id,item.text)+'</span>'+
 '<span class="showroom-shelf" aria-hidden="true"></span>'+
 '<span class="showroom-artwork-title">'+esc(item.text)+'</span>'+
 '<span class="showroom-artwork-meta">'+format(item.amount)+'원'+(collection.demo?' · 예시':'')+'</span>'+
 '</div>'
 ).join('');
 return '<div class="showroom-stage showroom-stage-'+theme.id+'" aria-label="'+esc(theme.name)+' 디자인 시연">'+
 '<div class="showroom-cornice" aria-hidden="true"></div>'+
 '<div class="showroom-decor" aria-hidden="true"></div>'+
 '<div class="showroom-stage-heading">'+esc(theme.label)+'</div>'+
 '<div class="showroom-wall" data-count="'+collection.items.length+'">'+fig+'</div>'+
 '<div class="showroom-stage-footer"><span>'+esc(theme.name)+'</span><span>'+ (collection.demo?'가상 예시 · 기록 미집계':'실제 기록으로 보여주는 디자인 시연')+'</span></div>'+
 '</div>';
}
export function showroomModal({themeId,items,icon,esc,format}){
 const themes=SHOWROOM_THEMES.map(x=>
 '<button type="button" class="showroom-variant'+(x.id===themeId?' selected':'')+
 '" data-action="showroom-theme" data-id="'+x.id+'" aria-pressed="'+(x.id===themeId)+'">'+
 '<span class="showroom-variant-dot showroom-variant-dot-'+x.id+'" aria-hidden="true"></span>'+
 '<span class="showroom-variant-label"><strong>'+x.name+'</strong><small>'+x.subtitle+'</small></span></button>'
 ).join('');
 return '<div class="showroom-modal-body"><div class="showroom-modal-intro">'+
 '<span class="showroom-kicker">CURATED SPACES · CONCEPT PREVIEW</span>'+
 '<p>나의 전시품을 다른 공간에서 감상한다면 어떨까요? 디자인만 자유롭게 구경해 보세요.</p></div>'+
 '<div class="showroom-variant-list" role="group" aria-label="미리보기 공간 종류">'+themes+'</div>'+
 '<div id="showroom-stage">'+showroomStage({themeId,items,icon,esc,format})+'</div>'+
 '<p class="showroom-disclaimer">이 화면은 특별 전시실의 <strong>기획 미리보기</strong>입니다. 저장된 테마·구매 상품·잠금 해제 기능이 아니며, 현재 결제할 수 없습니다. 판매 여부와 가격은 아직 확정되지 않았습니다.</p>'+
 '<div class="modal-actions"><button type="button" class="primary" data-action="'+(showroomItems(items).demo?'focus-form':'postcard-open')+'">'+(showroomItems(items).demo?'첫 전시품 등록하기':'내 전시 카드 무료 제작하기')+'</button><button type="button" class="secondary" data-action="premium-info">무료와 프리미엄의 차이</button><button type="button" class="secondary" data-action="cancel">나의 전시실로 돌아가기</button></div></div>';
}
