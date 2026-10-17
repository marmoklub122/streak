
const VERSION = 'streak-3b046534';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 's.3b046534.js', 's.3b046534.css',
  'assets/icons/apple-touch-icon.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'assets/img/av_ds.jpg', 'assets/img/av_ivan.jpg', 'assets/img/av_kate.jpg', 'assets/img/av_max.jpg', 'assets/img/av_volkov.jpg',
  'assets/img/post_cat.jpg', 'assets/img/post_coffee.jpg', 'assets/img/post_moto.jpg', 'assets/img/post_rocket.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
