// Offline support for Tasks. No dependencies.
// - Pages: network first, so a new release shows at once; the cached copy is used offline.
// - Files from this site and Google Fonts: served from the cache, refreshed in the background.
// - Everything else, and every non-GET request, is left to the browser.
const CACHE = 'tasks-v2';
const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
const SHELL = ['./', './app/', './manifest.webmanifest', './icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin && !FONT_ORIGINS.includes(url.origin)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        // Offline: the page itself if cached, else the app (inside /app/) or the start page.
        .catch(async () => (await caches.match(request))
          || (await caches.match(url.pathname.includes('/app/') ? './app/' : './'))
          || Response.error()),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const fresh = fetch(request)
        .then((response) => {
          if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached || Response.error());
      return cached || fresh;
    }),
  );
});
