import {SHOWROOM_THEMES,showroomTheme} from './showroom.js';
import {PREMIUM_PRODUCTS} from './premium-offer.js';
export function postcardModalHTML(themeId='atelier'){
 const id=showroomTheme(themeId).id;
 const themes=SHOWROOM_THEMES.map(t=>'<button type="button" class="postcard-theme'+(id===t.id?' selected':'')+'" data-action="postcard-theme" data-id="'+t.id+'" aria-pressed="'+(id===t.id)+'"><span class="postcard-theme-dot postcard-theme-dot-'+t.id+'" aria-hidden="true"></span>'+t.name+'</button>').join('');
 return '<div class="postcard-modal-body"><p class="postcard-overline">YOUR COLLECTION · FREE PREVIEW</p>'+
 '<p class="postcard-intro">내 전시품을 1080 × 1350 PNG 카드로 만들어 보세요. 아래 이미지는 무료 미리보기 표시가 포함된 결과물이며, 구매하지 않아도 저장할 수 있습니다.</p>'+
 '<div class="postcard-theme-list" role="group" aria-label="전시 카드 테마">'+themes+'</div>'+
 '<div id="postcard-preview-host" class="postcard-preview-host" role="status" aria-live="polite">나만의 전시 카드를 그리는 중입니다…</div>'+
 '<p class="postcard-terms">물건 이름과 가격은 이 기기에서 이미지로만 제작되며 서버로 전송되지 않습니다. 등록 금액은 실제 저축액이 아닙니다. 카드 공유는 사용자가 직접 결정합니다.</p>'+
 '<div class="modal-actions"><button type="button" id="postcard-export" class="primary" data-action="postcard-export" disabled>무료 미리보기 PNG 저장</button>'+
 '<button type="button" class="secondary" data-action="premium-info">프리미엄 차이 알아보기</button>'+
 '<button type="button" class="secondary" data-action="cancel">닫기</button></div></div>';
}
export function purchaseInformationHTML(){
 return '<div class="purchase-info"><p class="postcard-overline">ONE-TIME OWNERSHIP · PRODUCT PROPOSAL</p>'+
 '<h3>기록은 무료, 특별한 보관 방식만 유료</h3>'+
 '<p>무료 기능은 횟수 제한 없이 계속 사용할 수 있도록 설계했습니다. 아래는 출시 전 상품·가격 가안으로, 현재 실제 구매할 수 없습니다.</p>'+
 '<div class="purchase-compare"><div><strong>무료 박물관</strong><p>물건 등록·전시·기록 복구, 기본 전시실, 3가지 특별 공간의 미리보기, 미리보기 표시가 있는 고화질 카드</p></div>'+
 '<div><strong>'+PREMIUM_PRODUCTS.pass.title+'</strong><p>영구 이용권 가안 '+PREMIUM_PRODUCTS.pass.priceEstimateKRW.toLocaleString('ko-KR')+'원 · 판매 시 제공 예정: 특별 전시실 저장과 미리보기 표시 없는 전시 카드</p></div></div>'+
 '<p class="purchase-caveat">상품명·가격·기능은 심사 및 실결제 검증 전까지 확정되지 않았습니다. 현재 이 화면은 결제 정보를 수집하거나 결제를 요청하지 않습니다. 실제 상품 공개 시 환불·구매 복원·고객지원 정책을 함께 제공할 예정입니다.</p>'+
 '<div class="modal-actions"><button type="button" class="primary" disabled aria-disabled="true">정식 결제 준비 중 · 구매 불가</button><button type="button" class="secondary" data-action="cancel">닫기</button></div></div>';
}
