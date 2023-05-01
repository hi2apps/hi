// Cache the app shell and static assets
const cacheName = 'my-pwa-cache';
const filesToCache = [
  '/',
  'index.html',
  'assets/css/templatemo-softy-pinko.css',
  'assets/images/logo.png'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker ...');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell');
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker ...');
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== cacheName) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
});

// Serve cached app shell and static assets if available
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetching something...', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Found in cache', event.request.url);
          return response;
        }
        return fetch(event.request);
      })
  );
});
