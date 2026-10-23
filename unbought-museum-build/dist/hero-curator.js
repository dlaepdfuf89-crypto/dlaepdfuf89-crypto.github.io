import {selectExhibits,GALLERY_EXAMPLES} from './gallery.js';
import {museumObject} from './artwork.js';

// The feature room is a real, record-linked surface. The first-visit object is
// strictly a labeled example, never counted or persisted.
export function featuredExhibit(items){
 const item=selectExhibits(items,1)[0];
 return item?{...item,example:false}:{...GALLERY_EXAMPLES[0],example:true};
}
export function renderFeaturedExhibit({items,esc,format}){
 const host=document.getElementById('hero-curator');
 if(!host)return;
 const item=featuredExhibit(items);
 const name=esc(item.text);
 const category=({shoes:'신발',bag:'가방·패션',tech:'디지털',home:'생활용품',coffee:'취향용품',other:'그 밖의 물건'})[item.group]||'그 밖의 물건';
 host.dataset.state=item.example?'example':'real';
 host.innerHTML=
  '<div class="curator-ceiling" aria-hidden="true"><span></span><span></span><span></span></div>'+
  '<div class="curator-architecture" aria-hidden="true"><span class="curator-pillar curator-pillar-left"></span><span class="curator-pillar curator-pillar-right"></span></div>'+
  '<div class="curator-niche" aria-hidden="true">'+
    '<div class="curator-halo"></div>'+
    '<div class="curator-figure">'+museumObject(item.group,item.example?'':item.id,item.text)+'</div>'+
    '<div class="curator-ledge"><span></span></div>'+
    '<div class="curator-base"></div>'+
  '</div>'+
  '<div class="curator-museum-plaque">'+
   '<span class="curator-plaque-kicker">'+(item.example?'A STUDY IN WAITING · SAMPLE':'THE LIVING COLLECTION · SELECTED')+'</span>'+
   '<strong class="curator-plaque-title" title="'+name+'">'+name+'</strong>'+
   '<span class="curator-plaque-note">'+(item.example?'저장되지 않은 예시 · 실제 전시품 0점':esc(category)+' · 등록 가격 '+format(item.amount)+'원')+'</span>'+
   '<button type="button" class="curator-plaque-action" data-action="'+(item.example?'sample-prefill':'focus-exhibit')+'" data-id="'+(item.example?'0':esc(item.id))+'" aria-label="'+(item.example?'저장되지 않은 예시 '+name+' 등록하기':name+' 기록 보기')+'">'+(item.example?'이 물건으로 시작하기':'내 전시 기록 보기')+' <span aria-hidden="true">↗</span></button>'+
  '</div>';
}
