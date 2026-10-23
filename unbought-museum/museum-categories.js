// Conservative on-device category hint for the museum registration screen.
// Ambiguous product names return null: users always have the final choice.
// No network, personal records, analytics, or inferred brand/price details.
const SUGGESTION_RULES=Object.freeze({
 shoes:/(운동화|신발|구두|로퍼|스니커즈|부츠|장화|워커|슬리퍼|샌들|플랫슈즈|하이힐|sneakers?|shoes?|loafer|sandals?|boots?)/i,
 bag:/(가방|백팩|배낭|캐리어|여행가방|토트백|숄더백|크로스백|파우치|지갑|backpack|handbag|suitcase|wallet|tote.?bag)/i,
 tech:/(휴대폰|핸드폰|휴대전화|스마트폰|아이폰|갤럭시폰|카메라|미러리스|렌즈|헤드폰|헤드셋|이어폰|에어팟|갤럭시버즈|노트북|랩톱|맥북|태블릿|아이패드|모니터|키보드|마우스|스마트워치|애플워치|갤럭시워치|손목시계|휴대용게임기|smartphone|iphone|camera|headphones?|headset|earbuds?|airpods|laptop|macbook|tablet|keyboard|monitor|smart.?watch|wristwatch)/i,
 home:/(화분|식물|책상|테이블|의자|소파|쇼파|침대|수납장|가구|스탠드|조명|램프|무드등|전등|거울|쿠션|이불|러그|책장|책꽂이|desk|table|chair|sofa|couch|lamp|mirror|cushion|furniture)/i,
 coffee:/(커피|에스프레소|원두|드립|머그|찻잔|티포트|주전자|커피포트|텀블러|보온병|보틀|차세트|coffee|mug|tumbler|thermos|kettle)/i,
 other:/(소설|도서|독서|책(?!상|장|꽂이|가방)|반지|목걸이|귀걸이|주얼리|보드게임|피규어|장난감|novel|books?|novel|necklace|earrings?|jewelry)/i
});
export function suggestMuseumGroup(input){
 if(typeof input!=='string'||!input.trim())return null;
 const name=input.slice(0,80).trim();
 const matches=Object.entries(SUGGESTION_RULES).filter(([_,re])=>re.test(name)).map(([key])=>key);
 return matches.length===1?matches[0]:null;
}
