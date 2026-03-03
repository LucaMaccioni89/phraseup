// PhraseUp! Service Worker — network-first + instant update
// Bump this version string every deploy to force cache refresh
const CACHE = "phraseup-v4";
const OFFLINE_ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH: network-first — always try network, fall back to cache offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(cached =>
          cached || (e.request.mode === "navigate"
            ? caches.match("/index.html")
            : Response.error())
        )
      )
  );
});

// Allow app to force activation of new SW
self.addEventListener("message", e => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
