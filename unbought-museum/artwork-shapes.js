// Original museum artwork silhouettes, 2026. Each shape uses the 180×170 SVG
// stage and colors already covered by its category's four museum material sets.
// These are small stylized sculptures, not exact commercial product likenesses.
// Keyword matching stays local; raw record text never enters markup.
export const SHAPES=Object.freeze({
 shoes:Object.freeze({
  loafer:`<ellipse cx="91" cy="143" rx="69" ry="9" fill="#142a2b" opacity=".16"/>
<path d="M29 104c14-5 30-7 47-24l18-23 18 17 13 24c17 4 32 9 35 25v10H24l-2-15c0-6 2-11 7-14Z" fill="#c68d65"/>
<path d="M60 92c16-12 25-23 35-30l15 17 11 28-63 2Z" fill="#edd4bb"/>
<path d="M57 108c19 1 42 1 61-1" stroke="#9c694c" stroke-width="4" fill="none"/>
<path d="M71 94c15-7 28-7 41-1" stroke="#9c694c" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M23 127h138v10c-40 5-102 5-138 0Z" fill="#f4e9d8"/>
<path d="M47 131h97" stroke="#9d876e" stroke-width="2.5" stroke-linecap="round"/>`,
  slipper:`<ellipse cx="91" cy="143" rx="67" ry="9" fill="#142a2b" opacity=".16"/>
<path d="M23 108c2-14 11-24 26-27 25-6 71-6 96 9 14 8 17 22 14 36-2 11-119 14-132 4Z" fill="#f4e9d8"/>
<path d="M29 118c26 7 97 10 127 1v10c-25 11-107 11-127 2Z" fill="#c68d65"/>
<path d="M48 83c24-17 55-22 90-2l-8 35c-27-11-49-11-76 0Z" fill="#edd4bb"/>
<path d="M50 85c24-12 51-13 83-1" stroke="#9c694c" stroke-width="5" fill="none"/>
<path d="M64 115c18-9 40-9 57 0" stroke="#eac5a7" stroke-width="4" fill="none"/>`,
  boot:`<ellipse cx="94" cy="148" rx="69" ry="10" fill="#142a2b" opacity=".16"/>
<path d="M56 21h49l-3 63c7 13 19 22 39 24 12 2 18 10 19 22H25l-3-14c-1-9 8-15 20-19l16-11Z" fill="#c68d65"/>
<path d="M62 27h37l-5 63H63Z" fill="#edd4bb"/>
<path d="M60 31h41m-40 50 36 1" stroke="#9c694c" stroke-width="4"/>
<path d="M25 126h135v12c-47 4-94 4-135 0Z" fill="#f4e9d8"/>
<path d="M43 112c7-8 14-10 24-9" fill="none" stroke="#eac5a7" stroke-width="4"/>`
 }),
 bag:Object.freeze({
  backpack:`<ellipse cx="91" cy="151" rx="59" ry="8" fill="#142a2b" opacity=".17"/>
<path d="M54 60c-10-32 9-48 36-48 27 0 46 16 36 48" fill="none" stroke="#a56d48" stroke-width="11"/>
<path d="M63 38c4-9 16-15 27-15s23 6 27 15" fill="none" stroke="#dfbd8e" stroke-width="4"/>
<path d="M33 76C33 44 52 31 90 31s57 13 57 45v65H33Z" fill="#a56a49"/>
<path d="M44 75c2-21 19-31 46-31s44 10 46 31v56H44Z" fill="#b9835b"/>
<rect x="52" y="92" width="76" height="39" rx="12" fill="#d0a173"/>
<path d="M63 100h54" stroke="#d9ad81" stroke-width="5"/>
<rect x="82" y="88" width="16" height="19" rx="4" fill="#e8c88b"/>
<path d="M32 82c-10 18-9 34-3 46m122-46c10 18 9 34 3 46" stroke="#805238" stroke-width="7" fill="none"/>`,
  suitcase:`<ellipse cx="91" cy="151" rx="59" ry="8" fill="#142a2b" opacity=".17"/>
<path d="M70 46V31c0-9 7-14 20-14s20 5 20 14v15" fill="none" stroke="#a56d48" stroke-width="8"/>
<rect x="38" y="44" width="105" height="99" rx="14" fill="#a56a49"/>
<rect x="48" y="51" width="85" height="85" rx="10" fill="#b9835b"/>
<path d="M56 52v79m68-79v79" stroke="#d9ad81" stroke-width="7"/>
<rect x="80" y="82" width="21" height="16" rx="3" fill="#e8c88b"/>
<path d="M66 143v6m51-6v6" stroke="#805238" stroke-width="10" stroke-linecap="round"/>`,
  wallet:`<ellipse cx="92" cy="149" rx="66" ry="8" fill="#142a2b" opacity=".16"/>
<rect x="28" y="55" width="130" height="85" rx="12" fill="#a56a49"/>
<rect x="36" y="62" width="116" height="69" rx="8" fill="#b9835b"/>
<path d="M36 93h115" stroke="#805238" stroke-width="2" opacity=".48"/>
<path d="M41 72c30-9 75-9 103 0" stroke="#d9ad81" stroke-width="3" fill="none" opacity=".56"/>
<rect x="91" y="79" width="67" height="35" rx="8" fill="#d0a173"/>
<rect x="115" y="86" width="23" height="21" rx="5" fill="#e8c88b"/>
<circle cx="128" cy="96" r="3" fill="#805238"/>
<path d="M38 129c36 4 79 4 109 0" stroke="#e8bb8f" stroke-width="2" fill="none"/>`
 }),
 tech:Object.freeze({
  headphones:`<ellipse cx="91" cy="151" rx="53" ry="8" fill="#142a2b" opacity=".16"/>
<path d="M37 98V79c0-37 23-60 55-60s55 23 55 60v19" fill="none" stroke="#2b4249" stroke-width="17" stroke-linecap="round"/>
<path d="M46 93V79c0-30 18-48 46-48s46 18 46 48v14" fill="none" stroke="#74939c" stroke-width="7"/>
<rect x="29" y="84" width="35" height="58" rx="14" fill="#2b4249"/>
<rect x="38" y="92" width="18" height="41" rx="9" fill="#9bc8c6"/>
<rect x="119" y="84" width="35" height="58" rx="14" fill="#2b4249"/>
<rect x="127" y="92" width="18" height="41" rx="9" fill="#9bc8c6"/>
<path d="M64 107q28-8 55 0" stroke="#437882" stroke-width="5" fill="none" opacity=".65"/>`,
  camera:`<ellipse cx="91" cy="149" rx="66" ry="8" fill="#142a2b" opacity=".16"/>
<path d="M34 65h27l9-14h42l10 14h25c9 0 13 6 13 15v47c0 8-5 13-13 13H34c-9 0-14-5-14-13V80c0-9 5-15 14-15Z" fill="#2b4249"/>
<path d="M28 81h124v43H28Z" fill="#74939c"/>
<circle cx="92" cy="99" r="37" fill="#2b4249" stroke="#9bc8c6" stroke-width="6"/>
<circle cx="92" cy="99" r="26" fill="#437882"/>
<circle cx="92" cy="99" r="15" fill="#2b4249"/>
<path d="m78 83 10-10" stroke="#d4ece7" stroke-width="6" stroke-linecap="round"/>
<rect x="37" y="75" width="20" height="7" rx="3" fill="#9bc8c6"/>`,
  laptop:`<ellipse cx="91" cy="149" rx="68" ry="9" fill="#142a2b" opacity=".16"/>
<rect x="40" y="22" width="104" height="101" rx="9" fill="#2b4249"/>
<rect x="48" y="30" width="88" height="85" rx="5" fill="#9bc8c6"/>
<path d="M48 88c32-27 58-31 88-52v79H48Z" fill="#437882"/>
<path d="M22 123h142l-9 19H29Z" fill="#74939c"/>
<path d="M71 124h47l-3 6H74Z" fill="#d4ece7" opacity=".65"/>`,
  watch:`<ellipse cx="91" cy="151" rx="48" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M72 15h40l-5 41H77Zm5 112h30l5 27H72Z" fill="#74939c"/>
<path d="M78 17h29m-29 132h29" stroke="#9bc8c6" stroke-width="4"/>
<rect x="48" y="44" width="88" height="91" rx="24" fill="#2b4249"/>
<rect x="57" y="52" width="70" height="75" rx="17" fill="#9bc8c6"/>
<circle cx="92" cy="89" r="27" fill="#437882"/>
<path d="M92 67v22l14 11" stroke="#d4ece7" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="92" cy="89" r="4" fill="#2b4249"/>
<rect x="134" y="80" width="7" height="19" rx="3" fill="#74939c"/>`
 }),
 home:Object.freeze({
  lamp:`<ellipse cx="91" cy="151" rx="56" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M47 71 68 20h47l24 51Z" fill="#d5ae84"/>
<path d="M55 66 72 28h38l19 38Z" fill="#f8e6c9"/>
<path d="M48 72h92" stroke="#93694e" stroke-width="5" stroke-linecap="round"/>
<path d="M89 72v61" stroke="#b88962" stroke-width="9"/>
<path d="M58 137h62" stroke="#d5ae84" stroke-width="13" stroke-linecap="round"/>
<path d="M67 143h44" stroke="#93694e" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="92" cy="79" rx="29" ry="6" fill="#f8e6c9" opacity=".6"/>`,
  chair:`<ellipse cx="91" cy="152" rx="65" ry="8" fill="#142a2b" opacity=".14"/>
<rect x="49" y="23" width="88" height="99" rx="18" fill="#d5ae84"/>
<rect x="60" y="31" width="66" height="74" rx="13" fill="#f8e6c9"/>
<rect x="34" y="103" width="113" height="30" rx="12" fill="#b88962"/>
<path d="M51 129 43 148m82-19 8 19" stroke="#93694e" stroke-width="9" stroke-linecap="round"/>
<path d="M45 112 28 88m113 24 15-24" stroke="#93694e" stroke-width="7" stroke-linecap="round"/>`,
  desk:`<ellipse cx="91" cy="151" rx="68" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M20 79h144v20H20Z" fill="#d5ae84"/>
<path d="M25 81h134v7H25Z" fill="#f8e6c9"/>
<path d="M37 98v46m109-46v46" stroke="#93694e" stroke-width="13" stroke-linecap="round"/>
<path d="M38 111h107" stroke="#b88962" stroke-width="7"/>
<rect x="100" y="39" width="45" height="38" rx="4" fill="#d5ae84"/>
<path d="M107 47h31m-31 8h31m-31 8h22" stroke="#f8e6c9" stroke-width="3"/>
<rect x="36" y="48" width="50" height="28" rx="3" fill="#b88962"/>
<path d="M47 54h28m-28 8h28" stroke="#f8e6c9" stroke-width="2.5"/>`,
  sofa:`<ellipse cx="92" cy="150" rx="69" ry="8" fill="#142a2b" opacity=".14"/>
<rect x="33" y="48" width="116" height="68" rx="22" fill="#d5ae84"/>
<rect x="45" y="56" width="92" height="49" rx="15" fill="#f8e6c9"/>
<path d="M91 60v43" stroke="#b88962" stroke-width="3" opacity=".56"/>
<rect x="23" y="94" width="134" height="44" rx="18" fill="#b88962"/>
<rect x="39" y="99" width="106" height="30" rx="11" fill="#d5ae84"/>
<path d="M48 136v10m87-10v10" stroke="#93694e" stroke-width="10" stroke-linecap="round"/>
<path d="M47 105h87" stroke="#f8e6c9" stroke-width="3"/>`,
  mirror:`<ellipse cx="92" cy="151" rx="58" ry="8" fill="#142a2b" opacity=".14"/>
<rect x="49" y="14" width="87" height="108" rx="43" fill="#d5ae84"/>
<rect x="57" y="22" width="71" height="92" rx="35" fill="#f8e6c9"/>
<path d="M64 44c24-21 38-15 52-19" stroke="#b88962" stroke-width="8" opacity=".35" stroke-linecap="round" fill="none"/>
<path d="M68 69 114 30" stroke="#f8e6c9" stroke-width="8" opacity=".8"/>
<path d="M93 122v16" stroke="#93694e" stroke-width="9"/>
<rect x="57" y="136" width="72" height="12" rx="6" fill="#d5ae84"/>
<path d="M59 139h67" stroke="#f8e6c9" stroke-width="3"/>`
 }),
 coffee:Object.freeze({
  tumbler:`<ellipse cx="91" cy="149" rx="53" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M56 34h71l-8 102c-2 10-54 10-56 0Z" fill="#e1c3a1"/>
<path d="M68 49h48l-6 76c-2 6-35 6-36 0Z" fill="#f3debf"/>
<rect x="53" y="29" width="77" height="18" rx="8" fill="#ba936e"/>
<rect x="79" y="17" width="25" height="15" rx="5" fill="#c5a581"/>
<path d="M68 92h47" stroke="#ba936e" stroke-width="5" opacity=".65"/>
<path d="M78 134h28" stroke="#6f5141" stroke-width="4" stroke-linecap="round"/>`,
  kettle:`<ellipse cx="91" cy="150" rx="67" ry="8" fill="#142a2b" opacity=".14"/>
<path d="M48 87c0-30 16-49 46-49s46 19 46 49v29c0 20-91 20-92 0Z" fill="#e1c3a1"/>
<path d="M56 86c1-22 15-37 37-37 20 0 35 15 38 37" fill="#f3debf"/>
<path d="M133 76h20l-4 17-11 7" fill="#ba936e"/>
<path d="M50 90 26 80l18 25" fill="#ba936e"/>
<path d="M78 36c-1-20 9-25 17-25s18 5 17 25" fill="none" stroke="#c5a581" stroke-width="8"/>
<rect x="59" y="119" width="70" height="13" rx="6" fill="#ba936e"/>`
 }),
 other:Object.freeze({
  book:`<ellipse cx="91" cy="148" rx="67" ry="8" fill="#142a2b" opacity=".15"/>
<path d="M30 45c22-8 43-6 61 5v89c-20-10-41-12-61-4Z" fill="#ae825e"/>
<path d="M91 50c20-11 39-13 61-5v90c-19-8-41-6-61 4Z" fill="#c99d71"/>
<path d="M36 53c21-6 36-4 49 3v72c-16-7-33-8-49-4Z" fill="#debd8e"/>
<path d="M97 56c14-7 31-9 48-3v71c-15-4-32-3-48 4Z" fill="#f1dcaf"/>
<path d="M91 49v90" stroke="#b28b57" stroke-width="5"/>
<path d="M47 67c11-2 22-1 30 3m-30 11c11-2 22-1 30 3m-30 12c11-2 22-1 30 3" stroke="#b28b57" stroke-width="3" opacity=".7"/>
<path d="M105 69c11-4 22-5 30-2m-30 15c11-4 22-5 30-2" stroke="#ae825e" stroke-width="3" opacity=".6"/>`,
  jewelry:`<ellipse cx="91" cy="150" rx="61" ry="8" fill="#142a2b" opacity=".15"/>
<circle cx="91" cy="104" r="33" fill="none" stroke="#ae825e" stroke-width="13"/>
<path d="m91 30 24 23-8 31H75l-8-31Z" fill="#debd8e"/>
<path d="m91 30 16 23-16 22-16-22Z" fill="#c99d71"/>
<path d="M67 53h48" stroke="#f1dcaf" stroke-width="5" stroke-linecap="round"/>
<path d="M91 30v45M67 53l24-23 24 23" stroke="#b28b57" stroke-width="3" opacity=".65" fill="none"/>
<path d="M91 87v10" stroke="#f1dcaf" stroke-width="4" stroke-linecap="round"/>`
 })
});
const RULES=Object.freeze({
 shoes:Object.freeze([['loafer',/(구두|로퍼|플랫슈즈|정장화|하이힐|heels?|loafer)/i],['slipper',/(슬리퍼|샌들|쪼리|뮬|flip.?flop|sandal)/i],['boot',/(부츠|장화|워커|boots?)/i]]),
 bag:Object.freeze([['backpack',/(백팩|배낭|책가방|rucksack|backpack)/i],['suitcase',/(캐리어|여행가방|여행용 가방|suitcase|luggage)/i],['wallet',/(지갑|카드지갑|카드홀더|wallet|card.?holder)/i]]),
 tech:Object.freeze([['headphones',/(헤드폰|헤드셋|이어폰|에어팟|버즈|headphones?|headset|earbuds?|airpods)/i],['camera',/(카메라|미러리스|dslr|디카|lens|렌즈|camera)/i],['laptop',/(노트북|랩톱|맥북|laptops?|macbook)/i],['watch',/(스마트워치|애플워치|갤럭시워치|손목시계|smart.?watch|apple.?watch|wristwatch)/i]]),
 home:Object.freeze([['lamp',/(스탠드|조명|램프|무드등|전등|lighting|lamp)/i],['chair',/(의자|체어|chair)/i],['desk',/(책상|테이블|데스크|사무용 책상|desk|table)/i],['sofa',/(소파|쇼파|sofa|couch)/i],['mirror',/(거울|전신거울|탁상거울|mirror)/i]]),
 coffee:Object.freeze([['tumbler',/(텀블러|보온병|물병|보틀|thermos|tumbler|bottle)/i],['kettle',/(주전자|포트|케틀|커피포트|kettle)/i]]),
 other:Object.freeze([['book',/(책|도서|소설|독서|책자|books?|notebook)/i],['jewelry',/(반지|목걸이|귀걸이|주얼리|ring|necklace|earrings?|jewelry)/i]])
});
// This is a visual hint, never a classifier used in savings calculations.
// Unknown product names always retain the original museum category sculpture.
export function sculptureShape(group,text=''){
 if(typeof text!=='string'||!Object.hasOwn(RULES,group))return 'classic';
 const small=text.slice(0,160);
 for(const [key,re] of RULES[group])if(re.test(small))return key;
 return 'classic';
}
export function sculptureMarkup(group,shape){
 if(!Object.hasOwn(SHAPES,group))return null;
 return Object.hasOwn(SHAPES[group],shape)?SHAPES[group][shape]:null;
}
