// Minimal service worker - enables install but does NOT cache anything
// Users must be online to play = ads always load, analytics always track

const CACHE_NAME = "shot-o-clock-v1";

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
  console.log("Service Worker installed (minimal mode)");
});

self.addEventListener("activate", (event) => {
  // Clean up any old caches (prevents offline access)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  console.log("Service Worker activated (minimal mode)");
});

// IMPORTANT: No 'fetch' handler = no offline caching
// All requests go to network = ads and analytics work normally
