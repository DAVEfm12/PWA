// ================= CONFIGURACIÓN =================
const CACHE_NAME = 'Snackdrink-cache-v2';

const urlsToCache = [
  "./",
  "./index.html",
  "./reservaciones.html",
  "./imagenes/SD_logo.png",
  "./imagenes/logoDS.png"
];

// ================= INSTALACIÓN =================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Guardando en caché...");
      return cache.addAll(urlsToCache);
    })
  );
});

// ================= ACTIVACIÓN =================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      );
    })
  );
});

// ================= FETCH =================
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("index.html")
  );
});

self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "Nueva notificación";
  self.registration.showNotification("Snack & Drink DAVE's", {
    body: data,
    icon: "SD_logo.png"
  });
});

