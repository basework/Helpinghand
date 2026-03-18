const CACHE_NAME = "earn-buzz-v2"
const urlsToCache = [
  "/",
  "/dashboard",
  "/profile",
  "/airtime",
  "/data",
  "/withdraw",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// Install event
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("activate", (event) => {
  // Remove old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch event — skip API, auth, and firebase SW paths; serve rest from cache with network fallback
self.addEventListener("fetch", (event) => {
  const url = event.request.url
  // Never intercept API calls, Next.js internals, firebase SW, or cross-origin requests
  if (
    url.includes("/api/") ||
    url.includes("/_next/") ||
    url.includes("/firebase-messaging-sw.js") ||
    !url.startsWith(self.location.origin)
  ) {
    return // Let browser handle it directly
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  )
})

// Push event — handles VAPID / native Web Push (iOS PWA + web-push library)
self.addEventListener("push", (event) => {
  let payload = {}
  if (event.data) {
    try {
      payload = event.data.json()
    } catch {
      payload = { body: event.data.text() }
    }
  }

  // Support both flat payload and nested notification object
  const title = payload.title || payload.notification?.title || "FlashGain 9ja"
  const body = payload.body || payload.notification?.body || "You have a new alert"
  const icon = payload.icon || payload.notification?.icon || "/icons/icon-192x192.png"
  const clickUrl = payload.clickUrl || payload.data?.url || "/dashboard"

  const options = {
    body,
    icon,
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: payload.tag || "flashgain-push",
    renotify: true,
    requireInteraction: false,
    data: { url: clickUrl },
    actions: [
      { action: "open", title: "Open App" },
      { action: "close", title: "Dismiss" },
    ],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click — open or focus the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  if (event.action === "close") return

  const targetUrl = event.notification?.data?.url || "/dashboard"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if already open
      for (const client of clientList) {
        try {
          const clientPath = new URL(client.url).pathname
          const targetPath = new URL(targetUrl, self.location.origin).pathname
          if (clientPath === targetPath && "focus" in client) {
            return client.focus()
          }
        } catch (_) { /* ignore URL parse errors */ }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    }),
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const notification = event.data.notification || {}
    event.waitUntil(
      self.registration.showNotification(notification.title || "Earn Buzz", {
        body: notification.body || "",
        icon: notification.icon || "/icons/icon-192x192.png",
        badge: notification.badge || "/icons/icon-192x192.png",
        data: {
          url: notification.clickUrl || notification.link || "/",
        },
      }),
    )
  }
})
