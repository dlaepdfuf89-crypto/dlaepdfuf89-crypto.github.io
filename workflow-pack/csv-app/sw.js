/* WORKFLOW PACK CSV installable web app: cache only static shell, never user CSV data. */
'use strict';
const CACHE = 'wfp-csv-shell-20261029-v10';
const SHELL = [
  './',
  './index.html',
  './app.css',
  './guide.css',
  './app.js',
  './core.js',
  './icon.svg',
  './feature-showcase.svg',
  './manifest.webmanifest',
  './privacy.html'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('wfp-csv-shell-') && key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin ||
      !requestUrl.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  // Use fresh HTML when online so deployed buyer guidance does not stay stale.
  // Keep the offline shell working if the network is unavailable.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
        }
        return response;
      }).catch(async () =>
        (await caches.match(event.request)) ||
        (await caches.match('./index.html')) ||
        Response.error()
      )
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
