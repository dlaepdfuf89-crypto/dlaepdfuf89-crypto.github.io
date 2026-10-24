/* Offline shell only. Never cache a user's journal, API traffic, or export backups. */
const PREFIX = 'one-more-light-shell-';
const CACHE = PREFIX + '20261023-storefront1';
const CORE = ['./','index.html','app.js','model.js','style.css','lighting.css','premium.css','premium-v2.css','street-theatre.css','premium-store.css','premium-store.js','premium-catalog.js','icon.svg','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','assets/scene.png','assets/shop-books.webp','assets/shop-tea.webp','assets/shop-bread.webp','assets/shop-flowers.webp','assets/shop-noodles.webp','assets/shop-plants.webp','assets/premium/moonlight.webp','assets/premium/spring.webp','assets/premium/summer.webp','assets/premium/autumn.webp','assets/premium/winter.webp','assets/premium/aurora.webp'];
const resolved = CORE.map(path=>new URL(path,self.registration.scope).href);
const known = new Set(resolved);
const homepage = resolved[0];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache=await caches.open(CACHE);
    await cache.addAll(resolved);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const normalized=new URL(url.pathname,self.location.origin).href;
  const isShell=known.has(normalized);
  const isNavigation=req.mode==='navigate'&&(url.pathname===new URL(homepage).pathname||url.pathname===new URL(resolved[1]).pathname);
  if(!isShell&&!isNavigation)return;
  event.respondWith((async () => {
    const cache=await caches.open(CACHE);
    const matched=await cache.match(isNavigation?homepage:normalized);
    if(matched)return matched;
    return fetch(req);
  })());
});
