import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const chunks=path.join(import.meta.dirname,'app','src','main','assets','chunks'), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const expected='0316d9dc7489755426b255444f9d3994a1a8e3f89a4033401b6df342aaf549a9';
const parts=Array.from({length:11},(_,i)=>Buffer.from(fs.readFileSync(path.join(chunks,String(i).padStart(3,'0')+'.txt'),'utf8').trim(),'base64'));
const data=Buffer.concat(parts),html=data.toString('utf8');
if(sha(data)!==expected)throw Error('RC55 signed-release candidate integrity mismatch: '+sha(data));
for(const x of ['지금 플레이','광고 혜택','기체 선택','상점 · 강화','기록 · 시즌','초월 강화','광고 보고 부활'])
 if(!html.includes(x))throw Error('Required game content missing: '+x);
if(!html.includes('data:image/svg+xml;base64,')||!html.includes('data:audio/wav;base64,'))throw Error('Offline assets are missing');
console.log('ANDROID_RC55_SIGNING_CANDIDATE_ASSETS_PASS',JSON.stringify({bytes:data.length,sha256:expected,parts:parts.length}));