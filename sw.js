// ================= CONFIGURACIÓN =================
const CACHE_NAME = 'Snackdrink-cache-v3';

const urlsToCache = [
  "./",
  "./index.html",
  "./reservaciones.html",
  "./SD_logo.png",
  "./logoDS.png"
];

// ================= INSTALACIÓN =================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos agregados al caché ✔");
      return cache.addAll(urlsToCache);
    }).catch(err => console.error("Error al cachear:", err))
  );
  self.skipWaiting();
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
  self.clientsClaim();
});

// ================= FETCH =================
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => {
        return res || fetch(event.request)
          .catch(() => caches.match("./index.html"));
      })
  );
});

// ================= CLIC EN NOTIFICACIÓN =================
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes("index.html") && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow("./index.html");
      })
  );
});

// ================= PUSH NOTIFICATIONS =================
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "Tienes un mensaje nuevo";

  event.waitUntil(
    self.registration.showNotification("Snack & Drink DAVE's 🍹", {
      body: data,
      icon: "./SD_logo.png",
      badge: "./SD_logo.png",
      vibrate: [200, 100, 200],
      data: { url: "./index.html" }
    })
  );
});
