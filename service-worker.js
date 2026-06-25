const CACHE_NAME = "word-memory-folder-pwa-v20260625-folder-v23-module-switch";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./supplemental-words.js",
  "./supplemental-words-batch2.js",
  "./supplemental-words-batch3.js",
  "./supplemental-words-batch4.js",
  "./supplemental-words-batch5.js",
  "./supplemental-words-batch6.js",
  "./app.js",
  "./library-folder-data.js",
  "./folder-view.js",
  "./smart-vocab.js",
  "./styles.css",
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
