// Minimal offline-first service worker.
// Bump the version in CACHE whenever you change the cached files, and keep ASSETS
// in sync with the files the app needs to work offline.
const CACHE = "game-rules-v0.08";
const ASSETS = [
  ".",
  "index.html",
  "styles.css?v=0.08",
  "app.js?v=0.08",
  "games.js?v=0.08",
  "backgammon.js?v=0.08",
  "boggle.js?v=0.08",
  "cards.js?v=0.08",
  "president.js?v=0.08",
  "cambio.js?v=0.08",
  "version.js?v=0.08",
  "manifest.webmanifest",
  "icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// The page itself comes from the network when online (checking with the server, not the
// browser's own cache), so a new version shows on the first open after publishing; offline,
// the cached copy is used. Everything else is cache-first: its URLs carry ?v= and change with
// each version.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-cache" })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put("index.html", copy));
          }
          return response;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request))
  );
});
