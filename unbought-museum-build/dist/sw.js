// Museum offline shell. Intentionally never handles cross-origin requests,
// dynamic user records, JSON imports/exports, payments, or unrelated apps.
const CACHE_PREFIX='unbought-museum-shell-';
const CACHE_NAME=CACHE_PREFIX+'20261024-v24';
const APP_SHELL=[
  './','./index.html','./style.css','./gallery.css','./gallery-daylight.css','./form-atelier.css','./showroom.css','./premium-atelier.css','./curator-room.css','./monetization.css',
  './app.js','./model.js','./gallery.js','./artwork.js','./artwork-shapes.js','./artwork-finish.js','./museum-categories.js','./showroom.js','./hero-curator.js','./premium-offer.js','./postcard.js','./premium-entitlement.js','./postcard-ui.js',
  './icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png',
  './manifest.webmanifest','./privacy.html'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME).map(name=>caches.delete(name)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 const isDocument=event.request.mode==='navigate';
 if(isDocument){
  // Never save intro/help/unknown HTML under the application's home URL.
  // Overwriting the home shell here can break offline launch or reload.
  const homeRoot=new URL('./',self.registration.scope).pathname;
  const homeFile=new URL('./index.html',self.registration.scope).pathname;
  const isHome=url.pathname===homeRoot||url.pathname===homeFile;
  event.respondWith((async()=>{
   try{
    const response=await fetch(event.request);
    if(response.ok&&isHome){
     const cache=await caches.open(CACHE_NAME);
     await cache.put('./index.html',response.clone());
    }
    return response;
   }catch(_){
    if(isHome)return await caches.match('./index.html') || await caches.match('./') || Response.error();
    return Response.error();
   }
  })());
  return;
 }
 // Only cache resources explicitly listed in the app shell; do not cache arbitrary
 // URLs, API responses, export files, untrusted query strings, or other apps.
 const canonical=url.pathname;
 const allowed=APP_SHELL.some(rel=>new URL(rel,self.registration.scope).pathname===canonical);
 if(!allowed)return;
 event.respondWith((async()=>{
  const cached=await caches.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  return fetch(event.request);
 })());
});
