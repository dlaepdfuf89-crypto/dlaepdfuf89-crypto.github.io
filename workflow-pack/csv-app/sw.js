/* WORKFLOW PACK CSV installable web app: cache only static shell, never user CSV data. */
'use strict';
const CACHE = 'wfp-csv-shell-20261025-v5';
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
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
