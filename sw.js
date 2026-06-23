const CACHE = 'wild-salmon-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './game.js',
  './web_ads.js',
  './integrations.js',
  './ads.txt',
  './app-ads.txt',
  './privacy.html',
  './sitemap.xml',
  './robots.txt',
  './sounds.js',
  './visual_effects.js',
  './meta_economy.js',
  './mobile_fixes.js',
  './firebase-config.js',
  './firebase_leaderboard.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        // Сообщаем старым вкладкам, что SW обновился — они должны перезагрузиться.
        clients.forEach((c) => c.postMessage({ type: 'RELOAD_PLEASE' }));
      })
  );
});

// Позволяем странице форсировать немедленное обновление SW.
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// Код/разметка важнее свежести, чем оффлайн-кэш: HTML, CSS и JS берём
// network-first, чтобы сломанный/старый кэш больше никогда не «забеливал» сайт.
// Картинки/шрифты/прочие ассеты — cache-first (они версионируются через ?v=).
function isFreshFirst(request, url) {
  if (request.mode === 'navigate') return true;
  return /\.(?:html|css|js|json|xml|txt)$/i.test(url.pathname);
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (isFreshFirst(e.request, url)) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && res.type !== 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(e.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(e.request).then(
            (cached) => cached || caches.match('./index.html')
          )
        )
    );
    return;
  }

  // Статика: cache-first c фоновым обновлением.
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, copy)).catch(() => {});
        return res;
      });
    })
  );
});
