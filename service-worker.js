const CACHE_NAME = "word-memory-v69-exam-context-20260727";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./word-data.js?v=69examcontext20260727",
  "./library-folder-data.js?v=69examcontext20260727",
  "./context-engine.js?v=69examcontext20260727",
  "./context-data.js?v=69examcontext20260727",
  "./context-presenter.js?v=69examcontext20260727",
  "./app.js?v=69examcontext20260727",
  "./folder-view.js?v=69examcontext20260727",
  "./smart-vocab.js?v=69examcontext20260727",
  "./styles.css?v=69examcontext20260727",
  "./supabase-word-memory-repair.sql",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && new URL(event.request.url).origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
