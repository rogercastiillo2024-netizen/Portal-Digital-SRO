const CACHE_NAME = 'sro-cache-v3';

// Archivos principales que se guardan apenas se instala
const urlsToCache = [
  '/',
  '/index.html',
  'logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en cache, lo devuelve. Si no, lo busca en internet
      return response || fetch(event.request).then(fetchRes => {
        // Si es una imagen, la guardamos en cache para la próxima vez
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        }
        return fetchRes;
      });
    })
  );

});
