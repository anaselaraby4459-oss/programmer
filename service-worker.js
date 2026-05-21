const CACHE_VERSION = 'programmers-academy-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const APP_SHELL = [
  './', './index.html', './admin.html', './student.html', './parent.html',
  './manifest.webmanifest', './assets/img/logo-programmers.png', './assets/img/icon-192.png', './assets/img/icon-512.png', './assets/img/favicon.ico',
  './assets/css/design-system.css', './assets/js/platform.js', './assets/js/utils.js', './assets/js/error-handling.js', './assets/js/security.js', './assets/js/analytics.js', './assets/js/offline.js', './assets/js/ux-polish.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL)).catch(() => undefined));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => !key.startsWith(CACHE_VERSION)).map(key => caches.delete(key)))));
  self.clients.claim();
});
function isNavigation(req){ return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html'); }
async function networkFirst(req){
  const cache = await caches.open(RUNTIME_CACHE);
  try{
    const fresh = await fetch(req);
    if(fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  }catch(e){
    return (await cache.match(req)) || (await caches.match('./index.html')) || Response.error();
  }
}
async function staleWhileRevalidate(req){
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const fresh = fetch(req).then(res => { if(res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => cached);
  return cached || fresh;
}
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(isNavigation(req)){ event.respondWith(networkFirst(req)); return; }
  if(url.origin === location.origin || ['style','script','image','font'].includes(req.destination)){
    event.respondWith(staleWhileRevalidate(req));
  }
});
