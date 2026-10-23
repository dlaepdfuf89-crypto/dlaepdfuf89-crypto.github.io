import {sculptureShape,sculptureMarkup} from './artwork-shapes.js';
import {sculptureFineDetail} from './artwork-finish.js';
// Original, self-contained vector sculptures for the museum's six categories.
// Category representations, not product-specific photographs or menu icon enlargements.
const OBJECTS={
shoes:`<ellipse cx="91" cy="143" rx="69" ry="10" fill="#142a2b" opacity=".16"/>
<path d="M27 102c11-2 22-7 30-22l13-26 19 4 12 28c12 8 29 12 42 14 9 2 15 8 16 18l-1 10H22l-2-13c-1-7 1-10 7-13Z" fill="#c68d65"/>
<path d="M46 90 60 65c6-10 12-11 21-5l10 24-25 20Z" fill="#edd4bb"/>
<path d="M25 120c28-2 91-2 132 0l-1 14c-48 4-94 4-132 0Z" fill="#f4e9d8"/>
<path d="M25 132c42 2 91 2 132 0" stroke="#9d876e" stroke-width="3" fill="none"/>
<path d="m71 77 22 5m-26 4 28 5m-34 3 36 6" stroke="#faf4e9" stroke-width="4" stroke-linecap="round"/>
<path d="M115 108c14 1 25 1 35 6" stroke="#eac5a7" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M35 111c5-12 11-15 18-16" stroke="#9c694c" stroke-width="3" fill="none"/>`,
bag:`<ellipse cx="90" cy="144" rx="57" ry="9" fill="#142a2b" opacity=".17"/>
<path d="M60 65V49c0-22 11-35 31-35s31 13 31 35v16" fill="none" stroke="#a56d48" stroke-width="10" stroke-linecap="round"/>
<path d="M60 65V49c0-22 11-35 31-35s31 13 31 35v16" fill="none" stroke="#dfbd8e" stroke-width="4"/>
<path d="M41 57h98l7 83H34Z" fill="#a56a49"/>
<path d="M50 64h80l5 65H45Z" fill="#b9835b"/>
<path d="M42 59h97l-8 26c-2 7-9 12-17 12H67c-9 0-15-5-17-12Z" fill="#d0a173"/>
<path d="M51 65h79l-8 22H59Z" fill="#d9ad81"/>
<rect x="82" y="83" width="17" height="19" rx="3" fill="#e8c88b"/>
<rect x="88" y="86" width="5" height="14" rx="2" fill="#74513f"/>
<path d="M47 128h86" stroke="#805238" stroke-width="3"/>
<path d="M48 66 43 135m87-69 7 69" stroke="#e8bb8f" stroke-width="2" opacity=".7"/>`,
tech:`<ellipse cx="92" cy="149" rx="47" ry="7" fill="#142a2b" opacity=".16"/>
<path d="M55 18 71 12l69 10-1 123-18 7-68-13Z" fill="#74939c"/>
<rect x="52" y="14" width="80" height="133" rx="16" fill="#2b4249"/>
<rect x="59" y="22" width="66" height="115" rx="10" fill="#9bc8c6"/>
<path d="M59 91c17-28 35-32 66-59v105H59Z" fill="#437882"/>
<path d="M61 116c22-30 41-43 64-62" stroke="#d4ece7" stroke-width="8" fill="none" opacity=".5"/>
<path d="M73 27c7-4 14-4 25-3" stroke="#f7f4e8" stroke-width="3" stroke-linecap="round" opacity=".75"/>
<rect x="84" y="18" width="16" height="3" rx="2" fill="#162f38"/>
<circle cx="92" cy="142" r="2.5" fill="#f0e6cf"/>`,
home:`<ellipse cx="91" cy="147" rx="60" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M72 56c-20-16-22-26-13-32 13-9 25 8 23 32m10 6c0-26 7-42 19-37 15 6 5 30-14 41m-11-5c-5-30 0-44 11-46 11-2 17 18-3 45" fill="#73916e" stroke="#47664e" stroke-width="3"/>
<path d="M87 68c-13-24-28-28-30-17-4 17 18 24 30 26m12-10c16-22 28-25 34-13 6 13-15 20-34 24" fill="#a4b49a" stroke="#5b7b61" stroke-width="3"/>
<path d="M64 75c4 10 4 18 1 33-2 17 4 34 24 37h12c20-3 27-20 24-37-3-15-2-23 2-33Z" fill="#d5ae84"/>
<path d="M68 84c11 8 38 8 55 0" fill="none" stroke="#f8e6c9" stroke-width="5"/>
<path d="M74 107c9 6 24 11 43 5" fill="none" stroke="#b88962" stroke-width="4"/>
<path d="M68 76h57" stroke="#93694e" stroke-width="6" stroke-linecap="round"/>`,
coffee:`<ellipse cx="90" cy="147" rx="66" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M59 62c-2-16 6-26 21-26 11 0 17 6 19 17" stroke="#80664e" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M50 71h72l-8 55c-3 17-55 17-58 0Z" fill="#e1c3a1"/>
<path d="M59 83h54l-7 42c-2 12-35 13-39 0Z" fill="#f3debf"/>
<path d="M123 89h10c19 0 18 25-2 28h-13" fill="none" stroke="#ba936e" stroke-width="9"/>
<ellipse cx="86" cy="72" rx="36" ry="9" fill="#6f5141"/>
<ellipse cx="86" cy="72" rx="30" ry="5" fill="#a16b47"/>
<path d="M63 22c-10-8 9-16 0-25m22 27c-10-8 9-16 0-25m22 27c-10-8 9-16 0-25" stroke="#f3e7d1" stroke-width="4" opacity=".7" fill="none" stroke-linecap="round"/>
<path d="M43 139h95" stroke="#c5a581" stroke-width="5" stroke-linecap="round"/>`,
other:`<ellipse cx="92" cy="146" rx="56" ry="9" fill="#142a2b" opacity=".15"/>
<path d="m42 60 48-26 51 27-51 30Z" fill="#debd8e"/>
<path d="M42 62 90 89v52l-48-27Z" fill="#ae825e"/>
<path d="M90 89 141 61v53l-51 27Z" fill="#c99d71"/>
<path d="m64 47 52 27m-14-28-50 27" stroke="#f1dcaf" stroke-width="11"/>
<path d="m64 47 52 27m-14-28-50 27" stroke="#b28b57" stroke-width="3" opacity=".65"/>
<path d="M85 83v53m10-53v51" stroke="#f1ddae" stroke-width="7"/>
<path d="M82 37c-30-15-37-31-24-38 13-7 26 7 31 33 1-22 19-35 30-25 13 13-13 29-30 31Z" fill="#d5b577" stroke="#aa814d" stroke-width="4"/>`
};
// Small material families are derived from record identifiers; no photo uploads,
// external APIs, user text interpolation, or changes to the localStorage schema.
// Each group retains its recognizable sculpture silhouette and hand-drawn details.
// The first palette is the existing established museum design (sample cards).
const MATERIALS=Object.freeze({
 shoes:Object.freeze([
  Object.freeze({}),
  Object.freeze({'#c68d65':'#527a72','#edd4bb':'#c2d6c8','#9c694c':'#385a53','#eac5a7':'#99bfb0'}),
  Object.freeze({'#c68d65':'#777d98','#edd4bb':'#d4d7e7','#9c694c':'#535b79','#eac5a7':'#b6b7d0'}),
  Object.freeze({'#c68d65':'#955d65','#edd4bb':'#e7c6bd','#9c694c':'#693a48','#eac5a7':'#ca9e9e'}),
  Object.freeze({'#c68d65':'#b09057','#edd4bb':'#f1dfb9','#9c694c':'#78633d','#eac5a7':'#ddc698'})
 ]),
 bag:Object.freeze([
  Object.freeze({}),
  Object.freeze({'#a56a49':'#365c57','#b9835b':'#537b70','#d0a173':'#759d8b','#d9ad81':'#a6c7ac','#a56d48':'#38564f'}),
  Object.freeze({'#a56a49':'#5a556f','#b9835b':'#817b93','#d0a173':'#a09baa','#d9ad81':'#c6bac7','#a56d48':'#64516c'}),
  Object.freeze({'#a56a49':'#804b4c','#b9835b':'#a36861','#d0a173':'#c38f77','#d9ad81':'#ddb69a','#a56d48':'#844a47'}),
  Object.freeze({'#a56a49':'#9c7b45','#b9835b':'#b69b62','#d0a173':'#c8b77e','#d9ad81':'#e3d49a','#a56d48':'#77623c'})
 ]),
 tech:Object.freeze([
  Object.freeze({}),
  Object.freeze({'#74939c':'#64816d','#2b4249':'#2c4b41','#9bc8c6':'#b6cdb2','#437882':'#5b927b'}),
  Object.freeze({'#74939c':'#988b9f','#2b4249':'#534b68','#9bc8c6':'#d6c2da','#437882':'#866b9b'}),
  Object.freeze({'#74939c':'#ab9377','#2b4249':'#645248','#9bc8c6':'#f2d2a3','#437882':'#b37c60'}),
  Object.freeze({'#74939c':'#7188a4','#2b4249':'#303f61','#9bc8c6':'#b7c8e5','#437882':'#577ca5'})
 ]),
 home:Object.freeze([
  Object.freeze({}),
  Object.freeze({'#d5ae84':'#809c80','#b88962':'#5d7b65','#93694e':'#456754','#f8e6c9':'#c4d8bc'}),
  Object.freeze({'#d5ae84':'#8999a8','#b88962':'#6c7b91','#93694e':'#4c6376','#f8e6c9':'#cbd7e3'}),
  Object.freeze({'#d5ae84':'#b98184','#b88962':'#965e68','#93694e':'#744a55','#f8e6c9':'#ecd1ce'}),
  Object.freeze({'#d5ae84':'#c3aa76','#b88962':'#a58b53','#93694e':'#7b683e','#f8e6c9':'#f4e5b8'})
 ]),
 coffee:Object.freeze([
  Object.freeze({}),
  Object.freeze({'#e1c3a1':'#9bb2a0','#f3debf':'#c9dcc8','#ba936e':'#6c9381','#c5a581':'#a9bda5'}),
  Object.freeze({'#e1c3a1':'#b9abb9','#f3debf':'#e1d5e0','#ba936e':'#948097','#c5a581':'#c9b3c9'}),
  Object.freeze({'#e1c3a1':'#c58e81','#f3debf':'#f1cbb7','#ba936e':'#a56c62','#c5a581':'#dab19d'}),
  Object.freeze({'#e1c3a1':'#b7a76f','#f3debf':'#e6dfb2','#ba936e':'#8c7e51','#c5a581':'#d2c48a'})
 ]),
 other:Object.freeze([
  Object.freeze({}),
  Object.freeze({'#debd8e':'#a1c0ae','#ae825e':'#527c70','#c99d71':'#7fa695','#d5b577':'#a3bca1'}),
  Object.freeze({'#debd8e':'#c4b2d1','#ae825e':'#81688c','#c99d71':'#a18eae','#d5b577':'#c4b4ce'}),
  Object.freeze({'#debd8e':'#e4ad9e','#ae825e':'#a46a63','#c99d71':'#c98777','#d5b577':'#e1afa0'}),
  Object.freeze({'#debd8e':'#d5c48c','#ae825e':'#a38a53','#c99d71':'#c9b16f','#d5b577':'#e0c78d'})
 ])
});
export function sculptureMaterial(group,id=''){
 const safe=Object.hasOwn(OBJECTS,group)?group:'other';
 if(!id)return {group:safe,edition:0,colors:MATERIALS[safe][0]};
 // Deterministic unsigned FNV-1a. Stable across sessions/backups/devices.
 // Hash the opaque ID only; no private text is sent or placed in SVG attributes.
 let h=2166136261;
 for(const ch of String(id)){h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0}
 const edition=1+(h%(MATERIALS[safe].length-1));
 return {group:safe,edition,colors:MATERIALS[safe][edition]};
}
export function museumObject(group,id='',text=''){
 const {group:safe,edition,colors}=sculptureMaterial(group,id);
 const shape=sculptureShape(safe,text);
 // Exact-name visual hint only: unsupported names retain original sculpture.
 // Shape IDs are fixed code literals, never interpolated from user text.
 const base=sculptureMarkup(safe,shape)||OBJECTS[safe];
 // Fine details sit on top of the silhouette; static highlights do not overwrite
 // the record-specific original color finish or expose any user-entered text.
 const painted=base+sculptureFineDetail(safe,shape);
 const markup=painted.replace(/#[0-9a-fA-F]{6}/g,color=>colors[color.toLowerCase()]||color);
 return '<svg class="museum-object museum-object-'+safe+'" data-material="'+edition+'" data-shape="'+shape+'" viewBox="0 0 180 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+markup+'</svg>';
}
