const CACHE_NAME = "word-memory-folder-pwa-v20260630-v68-clean-runtime";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./supplemental-words.js?v=68",
  "./supplemental-words-batch2.js?v=68",
  "./supplemental-words-batch3.js?v=68",
  "./supplemental-words-batch4.js?v=68",
  "./supplemental-words-batch5.js?v=68",
  "./supplemental-words-batch6.js?v=68",
  "./supplemental-words-batch7.js?v=68",
  "./supplemental-words-batch8.js?v=68",
  "./supplemental-words-batch9.js?v=68",
  "./supplemental-words-batch10.js?v=68",
  "./supplemental-words-batch11.js?v=68",
  "./supplemental-words-batch12.js?v=68",
  "./supplemental-words-batch13.js?v=68",
  "./app.js?v=68",
  "./library-folder-data.js?v=68",
  "./folder-view.js?v=68",
  "./smart-vocab.js?v=68",
  "./styles.css?v=68",
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
