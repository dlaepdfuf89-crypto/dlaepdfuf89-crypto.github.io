// Non-secret, public-key-only entitlement verifier. No local "paid" checkbox
// or manually entered purchase token can grant this capability.
// Real production key deliberately absent until a store-backed validator is deployed.
export const PUBLIC_ENTITLEMENT_KEY=null;
const trustedInstances=new WeakSet();
const ALLOWED_PLATFORM=new Set(['google_play','onestore','toss']);
const PRODUCT='museum_gallery_pass_v1';
const MAX_LEASE_MS=7*86400000;
function bytesFromBase64Url(value){
 if(typeof value!=='string'||!/^[A-Za-z0-9_-]{20,4096}$/.test(value))throw new Error('인증 서명 형식이 잘못됐습니다.');
 const base=value.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((value.length+3)%4);
 if(typeof atob==='function')return Uint8Array.from(atob(base),ch=>ch.charCodeAt(0));
 return Uint8Array.from(Buffer.from(base,'base64'));
}
export function validGrantFields(value,now=Date.now()){
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 if(value.version!==1||value.productId!==PRODUCT||value.status!=='purchased'||!ALLOWED_PLATFORM.has(value.platform))return false;
 if(typeof value.leaseId!=='string'||!(/^[A-Za-z0-9_-]{12,128}$/).test(value.leaseId))return false;
 if(!Number.isSafeInteger(value.issuedAt)||!Number.isSafeInteger(value.leaseUntil)||!Number.isSafeInteger(now))return false;
 return value.issuedAt<=now+60000 &&
  value.leaseUntil>now &&
  value.leaseUntil>value.issuedAt &&
  value.leaseUntil-value.issuedAt<=MAX_LEASE_MS;
}
export async function verifyDetachedSignature(envelope,publicKey,now=Date.now()){
 if(!publicKey||!envelope||typeof envelope!=='object')return null;
 if(typeof envelope.payload!=='string'||envelope.payload.length>3000)return null;
 try{
  const signature=bytesFromBase64Url(envelope.signature);
  if(signature.length!==64)return null; // ECDSA P-256 IEEE P1363 (WebCrypto)
  const cryptoApi=globalThis.crypto;
  if(!cryptoApi?.subtle)return null;
  const key=await cryptoApi.subtle.importKey('jwk',publicKey,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  const data=new TextEncoder().encode(envelope.payload);
  const valid=await cryptoApi.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,signature,data);
  if(!valid)return null;
  const grant=JSON.parse(envelope.payload);
  return validGrantFields(grant,now)?Object.freeze({
   productId:PRODUCT,platform:grant.platform,leaseUntil:grant.leaseUntil
  }):null;
 }catch{return null}
}
export async function verifySignedGrant(envelope,now=Date.now()){
 // Production is intentionally fail-closed until a real issuing key is configured.
 if(!PUBLIC_ENTITLEMENT_KEY)return null;
 const result=await verifyDetachedSignature(envelope,PUBLIC_ENTITLEMENT_KEY,now);
 if(result)trustedInstances.add(result);
 return result;
}
export function isPremiumActive(verified,now=Date.now()){
 return !!(verified&&trustedInstances.has(verified)&&verified.productId===PRODUCT&&now<verified.leaseUntil);
}
