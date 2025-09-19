const CACHE_NAME = 'pe-scoreboard-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './PE TIMER LOG0.png',
  './buzzer.wav',
  './bell.wav',
  './Airhorn.wav',
  './whistle.wav'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(
        r =>
          r ||
          fetch(e.request).then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
            return res;
          })
      )
    );
  }
});