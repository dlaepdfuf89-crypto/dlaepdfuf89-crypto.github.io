// Catalog is a sales *hypothesis*. No SKU has been registered or sold.
// Prices are informational. This module never grants access or makes charges.
export const PRODUCT_CATALOG=Object.freeze([
 Object.freeze({id:'moonlight',name:'달빛 골목',priceKRW:2900,tag:'THE MOONLIGHT EDITION',description:'깊은 파란 밤, 은빛 달과 별의 반짝임',scenes:['moonlight'],skuDraft:{google:'oml_moonlight_theme',one:'oml.moonlight.theme',toss:'oml_moonlight_theme'}}),
 Object.freeze({id:'seasons',name:'사계절 골목',priceKRW:4900,tag:'FOUR SEASONS COLLECTION',description:'봄의 꽃잎부터 겨울의 눈꽃까지',scenes:['spring','summer','autumn','winter'],skuDraft:{google:'oml_seasons_pack',one:'oml.seasons.pack',toss:'oml_seasons_pack'}}),
 Object.freeze({id:'aurora',name:'오로라의 밤',priceKRW:7900,tag:'SIGNATURE NIGHT EDITION',description:'초록빛 오로라와 은은한 밤빛의 시그니처 테마',scenes:['aurora'],skuDraft:{google:'oml_aurora_edition',one:'oml.aurora.edition',toss:'oml_aurora_edition'}})
]);
export const SCENES=Object.freeze({
 moonlight:Object.freeze({name:'달빛 골목',note:'은은한 달과 별빛',sku:'moonlight'}),
 spring:Object.freeze({name:'봄빛 골목',note:'벚꽃이 흩날리는 밤',sku:'seasons'}),
 summer:Object.freeze({name:'여름 축제',note:'빛나는 등불의 거리',sku:'seasons'}),
 autumn:Object.freeze({name:'가을 산책',note:'황금빛 낙엽의 밤',sku:'seasons'}),
 winter:Object.freeze({name:'겨울 설경',note:'차분한 눈꽃 골목',sku:'seasons'}),
 aurora:Object.freeze({name:'오로라의 밤',note:'신비로운 초록빛 하늘',sku:'aurora'})
});
export function validateCatalog(){
 const ids=new Set();
 for(const product of PRODUCT_CATALOG){
  if(ids.has(product.id)||!Number.isInteger(product.priceKRW)||product.priceKRW<=0)throw Error('Invalid catalog');
  ids.add(product.id);
  if(!product.scenes.length||!product.scenes.every(s=>SCENES[s]?.sku===product.id))throw Error('Invalid scene mapping');
 }
 return true;
}
export function formattedPrice(n){return new Intl.NumberFormat('ko-KR').format(n)+'원'}
export const SALES_READY=false; // Fail closed until official verified purchase & restore integration.
