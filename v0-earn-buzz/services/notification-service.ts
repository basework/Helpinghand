// Service Worker Registration
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null
  try {
    const registration = await navigator.serviceWorker.register("/sw.js")
    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if ("Notification" in window) {
    return Notification.requestPermission()
  }
  return "denied"
}

// Show local notification
export function showLocalNotification(title: string, options?: NotificationOptions): void {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      ...options,
    })
  }
}

// Register device for FCM push notifications and save the token to the server.
// Call this after the user logs in (pass their uid).
export async function registerForFCM(uid: string): Promise<boolean> {
  try {
    const permission = await requestNotificationPermission()
    if (permission !== "granted") return false

    const sw = await registerServiceWorker()
    if (!sw) return false

    const { initializeApp, getApps } = await import("firebase/app")
    const { getMessaging, getToken } = await import("firebase/messaging")

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAXHBpjh7TfRHoOdxduMaxbACLmKhc10Ts",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "basework-76679.firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "basework-76679",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "basework-76679.firebasestorage.app",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "776150811852",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:776150811852:web:f0c69a11487993e5cd6e69",
    }

    if (!firebaseConfig.projectId || !firebaseConfig.apiKey || !firebaseConfig.appId || !firebaseConfig.messagingSenderId) {
      console.error("FCM registration aborted: incomplete Firebase config", firebaseConfig)
      return false
    }

    const vapidKey =
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
      "BLBi1so_KpGJtCt25Jpdq44NVgIrfSCPoGqE0jxw_dI5JVL59OqK3ODtuphKetG8VtM4vGUNFdXdMLOb0_dFsIA"

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: sw,
    })

    if (!token) return false

    await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, type: "fcm", token }),
    })

    return true
  } catch (error) {
    console.error("FCM registration failed:", error)
    return false
  }
}
