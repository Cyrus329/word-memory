const CACHE_NAME = "word-memory-folder-pwa-v20260629-v56-actions-audio-grid";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./supplemental-words.js?v=55",
  "./supplemental-words-batch2.js?v=55",
  "./supplemental-words-batch3.js?v=55",
  "./supplemental-words-batch4.js?v=55",
  "./supplemental-words-batch5.js?v=55",
  "./supplemental-words-batch6.js?v=55",
  "./supplemental-words-batch7.js?v=55",
  "./supplemental-words-batch8.js?v=55",
  "./supplemental-words-batch9.js?v=55",
  "./supplemental-words-batch10.js?v=55",
  "./supplemental-words-batch11.js?v=55",
  "./supplemental-words-batch12.js?v=55",
  "./supplemental-words-batch13.js?v=55",
  "./app.js?v=55",
  "./library-folder-data.js?v=55",
  "./folder-view.js?v=55",
  "./smart-vocab.js?v=55",
  "./styles.css?v=55",
  "./supabase-setup.sql",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./专升本英语词库_WordList1.json",
  "./专升本英语词库_WordList2.json",
  "./专升本英语词库_WordList3.json",
  "./专升本英语词库_WordList4.json",
  "./专升本英语词库_WordList5.json"
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
