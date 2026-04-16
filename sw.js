const CACHE_NAME = 'dango-v1';

const urlsToCache = [
  '/',
  '/index.html'
];

// 설치
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 활성화
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// 요청 처리 (오프라인 대응)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
