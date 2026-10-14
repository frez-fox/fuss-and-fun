/* FUSS & FUN: shows message notifications when the app is closed or in the background. */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA38OLVPkRAQpW8t9D-uNAoOv9YC0Tu_fw",
  authDomain: "fuss-and-fun.firebaseapp.com",
  projectId: "fuss-and-fun",
  storageBucket: "fuss-and-fun.firebasestorage.app",
  messagingSenderId: "531837027474",
  appId: "1:531837027474:web:f8b9b0f15329cd456e124b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  return self.registration.showNotification(d.title || 'FUSS & FUN', {
    body: d.body || '',
    tag: d.tag || 'ff-chat',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    renotify: true,
    data: { pair: d.pair || '' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const pair = (event.notification.data && event.notification.data.pair) || '';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          if (pair) c.postMessage({ openChat: pair });
          return c.focus();
        }
      }
      return self.clients.openWindow(pair ? '/?chat=' + encodeURIComponent(pair) : '/');
    })
  );
});
