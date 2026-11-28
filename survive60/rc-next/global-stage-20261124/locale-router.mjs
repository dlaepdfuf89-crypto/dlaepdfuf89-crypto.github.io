// SURVIVE60: isolated locale-routing candidate; global commercial activation is NOT enabled.
// Only the official native SDK's environment is consulted. Browser language and URL cannot authorize payments.
const ROUTES = {"ko": {"js": "/survive60/rc-next/global-stage-20261124/ko/assets/index-CKYiZ4li.js", "css": "/survive60/rc-next/global-stage-20261124/ko/assets/index-B1BbkUVw.css", "lang": "ko", "mode": "global-gated-stage"}, "en": {"js": "/survive60/rc-next/global-stage-20261124/en/assets/index-Vfq-z2bn.js", "css": "/survive60/rc-next/global-stage-20261124/en/assets/index-D3u0kSUM.css", "lang": "en", "mode": "global-gated-stage"}};
const DOMESTIC = {"js": "/survive60/rc-next/assets/index-s60-midnight-20261128.js", "css": "/survive60/rc-next/assets/index-BKITO0__.css", "lang": "ko", "mode": "domestic-existing"};
const BROWSER = {"js": "/survive60/rc-next/assets/index-CFPySwlR.js", "css": "/survive60/rc-next/assets/index-BKITO0__.css", "lang": "ko", "mode": "browser-existing"};
export function chooseOneplayEdition(ready, env) {
  if(ready !== true) return {...BROWSER};
  const supplied=env?.country;
  const country=typeof supplied==='string'&&/^[A-Za-z]{2}$/.test(supplied)?supplied.toUpperCase():null;
  const language=typeof env?.language==='string'?env.language.trim().toLowerCase().replace(/_/g,'-'):'';
  const ko=language==='ko'||language.startsWith('ko-')||(!language&&country==='KR');
  // Official SDK 1.2.0 returns userCountry=undefined for the Korean app.
  // Missing country + Korean SDK locale is therefore the domestic legacy host,
  // NOT a global staged build that would hide the already-live domestic IAP.
  // An explicit non-KR or malformed country never gains domestic checkout.
  const countryMissing=supplied===undefined||supplied===null||supplied==='';
  if(country==='KR'||(countryMissing&&ko)) return {...DOMESTIC};
  return {...ROUTES[ko?'ko':'en']};
}
export async function loadSelectedEdition(ready, env) {
  const target=chooseOneplayEdition(ready,env);
  if(target.mode==='global-gated-stage'){
    document.documentElement.lang=target.lang;
    const old=[...document.querySelectorAll('link[rel="stylesheet"]')];
    const link=document.createElement('link');
    link.rel='stylesheet';link.href=target.css;
    await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=()=>reject(new Error('locale_css_unavailable'));document.head.append(link);});
    for(const sheet of old){if(sheet.href.includes('/survive60/rc-next/assets/')) sheet.remove();}
  }
  return import(target.js);
}
