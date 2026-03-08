/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBtPwwHt-ijCMhx0XoA2zwdal5eTeTGrDU",
  authDomain: "app-mamyboo.firebaseapp.com",
  projectId: "app-mamyboo",
  storageBucket: "app-mamyboo.firebasestorage.app",
  messagingSenderId: "1076045195975",
  appId: "1:1076045195975:web:5fb6c76b141cd9756f2ce2",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "MamyBoo";
  const body = payload.notification?.body || "";

  self.registration.showNotification(title, {
    body,
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
    tag: "mamyboo-push",
    data: { url: payload.data?.url || "/painel" },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/painel";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});
