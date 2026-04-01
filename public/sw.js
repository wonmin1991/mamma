const CACHE_VERSION = "mamma-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const MAX_DYNAMIC_CACHE = 80;

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/guide",
  "/tips",
  "/restaurants",
];

const NAVIGATIONS = [
  "/restaurants",
  "/guide",
  "/tips",
  "/community",
  "/bookmarks",
  "/nursery",
  "/couple",
  "/search",
  "/settings",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.warn("[SW] precache failed:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map((k) => {
            console.log("[SW] deleting old cache:", k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    NAVIGATIONS.some((path) => new URL(request.url).pathname === path)
  );
}

function isNextAsset(url) {
  return url.pathname.startsWith("/_next/");
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await Promise.all(keys.slice(0, keys.length - maxItems).map((k) => cache.delete(k)));
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (isApiRequest(url)) return;

  if (isNextAsset(url)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
            trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE);
          }
          return response;
        } catch {
          return new Response("오프라인 상태입니다", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })
    );
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("/") || new Response("오프라인 상태입니다", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
