// Commerce catalogue is a prelaunch hypothesis, never a live checkout.
// The app must not grant an entitlement based on local flags, URL arguments,
// or unverified client-side purchase callbacks.
export const PREMIUM_PRODUCTS=Object.freeze({
 pass:Object.freeze({id:'museum_gallery_pass_v1',title:'프리미엄 박물관 영구 이용권',priceEstimateKRW:4900,type:'non_consumable',state:'not_for_sale'}),
 season:Object.freeze({id:'museum_room_season_v1',title:'추가 특별 전시실',priceEstimateKRW:1900,type:'non_consumable',state:'not_for_sale'})
});
export const COMMERCE_STATE=Object.freeze({liveCheckout:false,purchaseVerified:false,restoreVerified:false});
// In every channel the free core remains usable, and the mock screen never bills.
export function canStartPurchase(product,channel='web'){
 return !!(COMMERCE_STATE.liveCheckout && COMMERCE_STATE.purchaseVerified &&
  (channel==='google_play'||channel==='onestore'||channel==='toss') &&
  Object.values(PREMIUM_PRODUCTS).some(p=>p===product&&p.state==='on_sale'));
}
export function premiumOfferCopy(exhibitCount){
 const count=Number.isInteger(exhibitCount)&&exhibitCount>0?exhibitCount:0;
 if(!count)return Object.freeze({kicker:'A SPACE FOR YOUR CHOICES',title:'첫 전시품부터 시작해 보세요.',description:'물건 하나를 기록한 뒤, 나만의 전시 카드와 특별한 갤러리를 구경할 수 있어요.',action:'focus-form',actionText:'첫 물건 등록하기'});
 return Object.freeze({kicker:'YOUR COLLECTION, BEAUTIFULLY KEPT',title:'이 선택을 한 장의 작품으로.',description:'내 전시품으로 꾸민 고화질 컬렉션 카드를 먼저 무료로 만들어 보세요.',action:'postcard-open',actionText:'무료 전시 카드 만들기'});
}
export function premiumOfferHTML({exhibitCount,esc}){
 const offer=premiumOfferCopy(exhibitCount), e=esc??(x=>String(x));
 return '<div class="premium-value-copy">'+
  '<p class="premium-value-eyebrow">'+offer.kicker+'</p>'+
  '<h2 id="expansion-title">'+e(offer.title)+'</h2>'+
  '<p>'+e(offer.description)+'</p>'+
  '<div class="premium-offer-actions">'+
    '<button type="button" class="premium-create-button" data-action="'+offer.action+'">'+e(offer.actionText)+' <span aria-hidden="true">↗</span></button>'+
    '<button type="button" class="premium-preview-button" data-action="showroom-open">특별 전시실 둘러보기</button>'+
  '</div>'+
  '<p class="premium-offer-note">기본 기록과 전시는 계속 무료 · 판매 상품은 개발 중</p>'+
 '</div>';
}
