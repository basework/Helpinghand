// Firebase Messaging Service Worker
// This file MUST be at /firebase-messaging-sw.js (served from public root)
// Firebase SDK loads it for background push notification handling

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

// Firebase config — must match what's used in the app
firebase.initializeApp({
  apiKey: "AIzaSyAXHBpjh7TfRHoOdxduMaxbACLmKhc10Ts",
  authDomain: "basework-76679.firebaseapp.com",
  projectId: "basework-76679",
  storageBucket: "basework-76679.firebasestorage.app",
  messagingSenderId: "776150811852",
  appId: "1:776150811852:web:f0c69a11487993e5cd6e69",
})

const messaging = firebase.messaging()

// Handle background FCM messages (app closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw] Background message received:", payload)

  const notificationTitle = payload.notification?.title || payload.data?.title || "FlashGain 9ja"
  const notificationBody = payload.notification?.body || payload.data?.body || ""
  const clickUrl = payload.data?.clickUrl || payload.fcmOptions?.link || "/dashboard"

  const notificationOptions = {
    body: notificationBody,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: payload.data?.tag || "flashgain-notification",
    renotify: true,
    data: {
      url: clickUrl,
      messageId: payload.messageId,
    },
    actions: [
      { action: "open", title: "Open App" },
      { action: "close", title: "Dismiss" },
    ],
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click — open/focus app window
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const targetUrl = event.notification?.data?.url || "/dashboard"

  if (event.action === "close") return

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus an existing open window
        for (const client of clientList) {
          const clientPath = new URL(client.url).pathname
          const targetPath = new URL(targetUrl, self.location.origin).pathname
          if (clientPath === targetPath && "focus" in client) {
            return client.focus()
          }
        }
        // No existing window — open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl)
        }
      }),
  )
})
