const CACHE_NAME = 'mcurator-mobile-shell-v4';
const SHELL_URLS = [
  './mobile.html',
  './index.html',
  './brand/mark-app.jpg',
  './brand/mark-simple-light.jpg',
  './mobile-offline.html',
  './manifest.webmanifest',
];

function isPrivateRequest(request) {
  if (request.method !== 'GET') return true;
  if (request.headers.get('Authorization')) return true;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return true;
  if (/\/api(\/|$)/i.test(url.pathname)) return true;
  if (/[?&](token|access_token|auth)=/i.test(url.search)) return true;
  return false;
}

function isHashedAsset(pathname) {
  return pathname.includes('/assets/') && /\.[a-z0-9]{8,}\.(js|css|woff2?|png|svg|webp)$/i.test(pathname);
}

function isHtmlDocument(pathname) {
  return (
    pathname.endsWith('.html') ||
    pathname.endsWith('/mobile') ||
    pathname.endsWith('/mobile/') ||
    /\/mobile\/?$/i.test(pathname)
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type;
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (type === 'CLEAR_SHELL_CACHE') {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith('mcurator-mobile')).map((key) => caches.delete(key))),
      ),
    );
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Always prefer network for navigations / HTML so publishes show up without waiting on SW shell.
  if (event.request.mode === 'navigate' || isHtmlDocument(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = (await caches.match(event.request)) || (await caches.match('./mobile.html'));
          if (cached) return cached;
          const offline = await caches.match('./mobile-offline.html');
          return offline ?? Response.error();
        }),
    );
    return;
  }

  if (isPrivateRequest(event.request)) return;
  if (url.origin !== self.location.origin) return;

  const cacheable =
    SHELL_URLS.some((item) => url.pathname.endsWith(item.replace('./', '/'))) || isHashedAsset(url.pathname);
  if (!cacheable) return;

  // Hashed assets: stale-while-revalidate (show cache fast, refresh in background).
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached ?? network;
    }),
  );
});
