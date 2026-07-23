const CACHE_NAME = "word-memory-v68-mobile-storage-dual-20260723";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./word-data.js?v=68mobilestoragedual",
  "./app.js?v=68mobilestoragedual",
  "./library-folder-data.js?v=68mobilestoragedual",
  "./folder-view.js?v=68mobilestoragedual",
  "./smart-vocab.js?v=68mobilestoragedual",
  "./styles.css?v=68mobilestoragedual",
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
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
