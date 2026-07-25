const CACHE = "moist-entropy-v1";
const SHELL = ["/", "/offline", "/manifest.webmanifest", "/icon.svg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(response => { if (event.request.url.startsWith(self.location.origin)) { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy)); } return response; }).catch(async () => (await caches.match(event.request)) || (event.request.mode === "navigate" ? caches.match("/offline") : Response.error())));
});
