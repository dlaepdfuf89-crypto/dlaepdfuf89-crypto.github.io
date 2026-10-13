// Survive60 Android LEGACY-WEBVIEW compatibility packaging (staging only).
// Do not alter production ONEplay HTML or Toss RC54/RC55; the verified source
// chunks remain in GitHub. This transforms only a CI runner's working tree.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url);
const ts=require(process.env.S60_TYPESCRIPT_PATH || 'typescript');
const root=path.join(import.meta.dirname,'app','src','main','assets','chunks');
const sourceSha='6e058da40ddae14f0fed0abfdef871925badf898e3e14f5f6c3a8b52fd7596fb';
const targetSha='4f62ab0072bacb047cbfba9e587664801796073bbbfe874e0265ddc6e30aeffe';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const parts=[];
for(let i=0;i<11;i++){
  const p=path.join(root,String(i).padStart(3,'0')+'.txt');
  parts.push(Buffer.from(fs.readFileSync(p,'utf8').trim(),'base64'));
}
const original=Buffer.concat(parts);
if(digest(original)!==sourceSha || original.length!==4073600)throw Error('Original approved HTML chunk hash mismatch: abort');
const html=original.toString('utf8');
const exp=/<script\s+type=["']module["']\s*>([\s\S]*?)<\/script>/i;
const match=exp.exec(html);
if(!match)throw Error('Game bundle module not found');
const input=match[1];
const res=ts.transpileModule(input,{fileName:'android_bundle.js',reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2017,module:ts.ModuleKind.ESNext,allowJs:true,removeComments:false,newLine:ts.NewLineKind.LineFeed}});
const errors=(res.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);
if(errors.length)throw Error('Legacy compile errors: '+errors.slice(0,3).map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join(' | '));
const changed=html.slice(0,match.index)+match[0].replace(input,res.outputText)+html.slice(match.index+match[0].length);
const bytes=Buffer.from(changed,'utf8');
if(digest(bytes)!==targetSha)throw Error('Android transpilation hash drift: '+digest(bytes));
if((res.outputText.match(/\?\./g)||[]).length)throw Error('Optional chaining not fully transpiled');
for(let i=0;i<11;i++){
 const fragment=bytes.subarray(Math.floor(bytes.length*i/11),Math.floor(bytes.length*(i+1)/11));
 fs.writeFileSync(path.join(root,String(i).padStart(3,'0')+'.txt'),fragment.toString('base64')+'\n');
}
const verify=Buffer.concat(Array.from({length:11},(_,i)=>Buffer.from(fs.readFileSync(path.join(root,String(i).padStart(3,'0')+'.txt'),'utf8').trim(),'base64')));
if(digest(verify)!==targetSha)throw Error('Chunk rewrite integrity mismatch');
const report=[
 'ANDROID STAGING WEBVIEW COMPATIBILITY BUNDLE - 2026-10-13',
 'Source ONEplay verified HTML SHA256: '+sourceSha,
 'New Android ONLY compat HTML SHA256: '+targetSha,
 'Original bytes: '+original.length,
 'Android transpiled bytes: '+bytes.length,
 'Compiler TypeScript '+ts.version+' target ES2017, module ESNext',
 'This is NOT the ONEplay public game HTML and is NOT the Toss RC54/RC55 build.',
 'Does NOT prove mobile gameplay, ads, IAP, on-device security or ONEstore review.',
].join('\n')+'\n';
fs.writeFileSync(path.join(import.meta.dirname,'compat-html-audit.txt'),report);
console.log('ANDROID_HTML_COMPAT_TRANSPILE_PASS',JSON.stringify({sourceSha,targetSha,bytes:bytes.length,compiler:ts.version}));
