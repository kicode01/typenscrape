const CACHE_NAME = 'typenscrape-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/cef3f1b2-69eb-49e3-89aa-4cac84df549a.png'
];

// Install Service Worker and cache essential static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new Service Worker version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clear ALL old cache versions immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new Service Worker version:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache storage:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Optimized Caching Strategies for Low-End Devices
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  // 1. CACHE-FIRST strategy for large static recipe chunks (/data/chunk_*.json)
  // Ensures low-end devices load instantly without re-downloading megabytes of data
  if (event.request.url.includes('/data/chunk_')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. NETWORK-FIRST strategy for HTML navigation and JS/CSS assets
  // Ensures live application updates deploy instantly
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed (Device is offline) -> serve from Cache Storage
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
