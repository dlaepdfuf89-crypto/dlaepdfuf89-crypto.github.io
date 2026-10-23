import {showroomTheme,showroomItems} from './showroom.js';
import {museumObject} from './artwork.js';
import {isPremiumActive} from './premium-entitlement.js';

// A working, private, zero-fee postcard maker. Every image is generated locally.
// Free exports are conspicuously labeled as previews, never a paid entitlement.
export const CARD_WIDTH=1080;
export const CARD_HEIGHT=1350;
export const PREVIEW_LABEL='무료 체험 미리보기';
const palettes=Object.freeze({
 atelier:Object.freeze({wall:'#f6eedc',field:'#d4b785',ink:'#2f503f',muted:'#6c715e',gold:'#a8874c',panel:'#fffdf3',line:'#c3ad84'}),
 midnight:Object.freeze({wall:'#102e39',field:'#184651',ink:'#f6eed9',muted:'#b9dcd5',gold:'#d1ae72',panel:'#244f57',line:'#57939a'}),
 amber:Object.freeze({wall:'#42332d',field:'#72513b',ink:'#fff1d9',muted:'#e8c6a0',gold:'#e6b871',panel:'#654934',line:'#c59560'})
});
function line(ctx,x,y,w,color,alpha=1){
 ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(CARD_WIDTH-x,y);ctx.stroke();ctx.restore();
}
function clipText(text,length=17){
 const str=String(text??'');
 return str.length>length?str.slice(0,length-1)+'…':str;
}
function roundBox(ctx,x,y,w,h,r=24){
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);
}
function imageFromMarkup(svg){
 return new Promise(resolve=>{
  const blob=new Blob([svg],{type:'image/svg+xml'});
  const src=URL.createObjectURL(blob),img=new Image();
  const done=v=>{URL.revokeObjectURL(src);resolve(v)};
  img.onload=()=>done(img);img.onerror=()=>done(null);
  img.src=src;
 });
}
export async function makePostcardCanvas({themeId='atelier',items,documentRef=document,verifiedGrant=null}){
 const premium=isPremiumActive(verifiedGrant);
 const theme=showroomTheme(themeId),p=palettes[theme.id],collection=showroomItems(items||[]);
 const c=documentRef.createElement('canvas');c.width=premium?CARD_WIDTH*2:CARD_WIDTH;c.height=premium?CARD_HEIGHT*2:CARD_HEIGHT;
 const ctx=c.getContext('2d');if(!ctx)throw new Error('이 브라우저에서는 전시 카드 이미지를 만들 수 없어요.');
 if(premium)ctx.scale(2,2);
 const bg=ctx.createLinearGradient(0,0,CARD_WIDTH,CARD_HEIGHT);bg.addColorStop(0,p.wall);bg.addColorStop(1,p.field);
 ctx.fillStyle=bg;ctx.fillRect(0,0,CARD_WIDTH,CARD_HEIGHT);
 const glow=ctx.createRadialGradient(430,160,25,540,380,780);
 glow.addColorStop(0,'#ffffff35');glow.addColorStop(1,'#ffffff00');
 ctx.fillStyle=glow;ctx.fillRect(0,0,CARD_WIDTH,CARD_HEIGHT);
 ctx.strokeStyle=p.gold;ctx.lineWidth=5;ctx.strokeRect(42,40,996,1270);
 ctx.strokeStyle=p.line;ctx.lineWidth=1.8;ctx.strokeRect(55,53,970,1244);
 ctx.fillStyle=p.gold;ctx.font='bold 24px Georgia, serif';ctx.textAlign='center';
 ctx.fillText('THE UNBOUGHT MUSEUM',540,116);
 line(ctx,115,151,2,p.gold,.7);
 ctx.fillStyle=p.ink;ctx.font='bold 61px "Noto Serif KR","Malgun Gothic",sans-serif';
 ctx.fillText('나의 선택을 전시하다',540,234);
 ctx.font='25px "Malgun Gothic",sans-serif';ctx.fillStyle=p.muted;
 ctx.fillText(theme.name+' · '+(collection.demo?'미저장 예시':'내가 전시한 물건'),540,281);
 const show=collection.items.slice(0,3);
 const w=show.length===1?510:show.length===2?385:270,gap=31;
 const total=w*show.length+gap*(show.length-1);
 const origin=(CARD_WIDTH-total)/2;
 for(let i=0;i<show.length;i++){
  const item=show[i],x=origin+i*(w+gap),y=342;
  const arch=ctx.createLinearGradient(x,y,x+w,y+680);
  arch.addColorStop(0,p.panel);arch.addColorStop(1,p.field);
  ctx.fillStyle=arch;roundBox(ctx,x,y,w,660,100);ctx.fill();
  ctx.strokeStyle=p.line;ctx.lineWidth=5;ctx.stroke();
  ctx.save();roundBox(ctx,x+8,y+8,w-16,636,90);ctx.clip();
  const lamp=ctx.createRadialGradient(x+w/2,y+85,15,x+w/2,y+300,280);
  lamp.addColorStop(0,'#fffceda8');lamp.addColorStop(1,'#ffffff00');
  ctx.fillStyle=lamp;ctx.fillRect(x+10,y+15,w-20,560);
  ctx.restore();
  const image=await imageFromMarkup(museumObject(item.group,collection.demo?'':item.id,item.text));
  if(image){
   const artWidth=Math.min(w-26,show.length===1?375:show.length===2?300:230);
   const artHeight=show.length===1?343:show.length===2?290:242;
   ctx.drawImage(image,x+(w-artWidth)/2,y+128,artWidth,artHeight);
  }
  else{ctx.fillStyle=p.gold;ctx.beginPath();ctx.arc(x+w/2,y+270,44,0,Math.PI*2);ctx.fill()}
  ctx.fillStyle=p.gold;roundBox(ctx,x+19,y+455,w-38,17,8);ctx.fill();
  ctx.fillStyle=p.ink;ctx.textAlign='center';
  ctx.font='bold 25px "Malgun Gothic",sans-serif';
  ctx.fillText(clipText(item.text,13),x+w/2,y+535);
  ctx.font='22px "Malgun Gothic",sans-serif';ctx.fillStyle=p.muted;
  ctx.fillText(Number(item.amount).toLocaleString('ko-KR')+'원'+(collection.demo?' · 예시':''),x+w/2,y+576);
 }
 line(ctx,115,1060,2,p.gold,.72);
 ctx.textAlign='center';ctx.fillStyle=p.ink;ctx.font='bold 25px "Malgun Gothic",sans-serif';
 ctx.fillText(collection.demo?'저장되지 않은 예시 카드':'사지 않기로 한 물건의 등록 가격 기록',540,1120);
 ctx.fillStyle=p.muted;ctx.font='22px "Malgun Gothic",sans-serif';
 ctx.fillText('등록 금액은 실제 저축액이 아닙니다.',540,1164);
 if(!premium){ctx.save();ctx.translate(540,700);ctx.rotate(-Math.PI/9);
 ctx.fillStyle=theme.id==='atelier'?'#5d665c2a':'#f8f0d733';ctx.textAlign='center';
 ctx.font='bold 71px "Malgun Gothic",sans-serif';ctx.fillText(PREVIEW_LABEL,0,0);ctx.restore()}
 ctx.fillStyle=p.gold;ctx.font='bold 21px Georgia,serif';ctx.fillText('A MOMENT WORTH KEEPING',540,1248);
 return c;
}
export async function previewPostcard({themeId,items}){
 const canvas=await makePostcardCanvas({themeId,items});
 return canvas;
}
export function downloadPostcard(canvas){
 if(!canvas||typeof canvas.toBlob!=='function')return Promise.reject(new Error('전시 카드가 준비되지 않았습니다.'));
 if(globalThis.AndroidMuseum?.saveImage){
  try{
   const file=canvas.width===2160&&canvas.height===2700?'museum-premium-2160x2700.png':'museum-free-preview-1080x1350.png';
   const data=canvas.toDataURL('image/png');
   if(!data.startsWith('data:image/png;base64,'))throw new Error('PNG 이미지를 인코딩하지 못했습니다.');
   globalThis.AndroidMuseum.saveImage(file,data.slice('data:image/png;base64,'.length));
   return Promise.resolve('native-picker');
  }catch(err){return Promise.reject(err)}
 }
 return new Promise((resolve,reject)=>{
  canvas.toBlob(blob=>{
   if(!blob){reject(new Error('이미지를 저장할 수 없습니다.'));return}
   const url=URL.createObjectURL(blob);
   const a=document.createElement('a');a.href=url;a.download=canvas.width===2160&&canvas.height===2700?'museum-premium-2160x2700.png':'museum-free-preview-1080x1350.png';a.click();
   setTimeout(()=>URL.revokeObjectURL(url),1000);resolve();
  },'image/png');
 });
}
