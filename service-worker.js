const CACHE_NAME = 'buddhist-meditimer-cache-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './css/becss.css',
  './app.js',
  './LICENSE.md',
  './README.md',
  './images/favicon.ico',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/main-logo.webp',
  './gong.mp3'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});

