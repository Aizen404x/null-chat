"use client";

export type EnableNotificationsResult = {
  ok: boolean;
  push: boolean;
  message: string;
  hint?: string;
};

function isLocalhostHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Web Push only works on HTTPS, or on http://localhost / http://127.0.0.1.
 * LAN IPs like http://192.168.x.x cannot use Web Push in Chrome/Firefox.
 */
export function canSubscribeToPush() {
  if (typeof window === "undefined") return false;
  if (!window.isSecureContext) return false;
  if (!("PushManager" in window)) return false;
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()) return false;

  const { protocol, hostname } = window.location;
  if (protocol === "https:") return true;
  return isLocalhostHost(hostname);
}

export function getPushLimitationHint() {
  if (typeof window === "undefined") return undefined;

  const { protocol, hostname } = window.location;

  if (protocol !== "https:" && !isLocalhostHost(hostname)) {
    return "For push when the tab is closed, open http://localhost:3000 or deploy with HTTPS.";
  }

  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()) {
    return "Add VAPID keys to .env.local for push when the tab is closed.";
  }

  return undefined;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  return registration;
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export async function subscribeToPush() {
  if (!canSubscribeToPush()) {
    throw new Error("Web Push is not available in this context");
  }

  const registration = await navigator.serviceWorker.ready;
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!.trim();

  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    await existing.unsubscribe();
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription }),
  });

  if (!response.ok) {
    throw new Error("Failed to save push subscription on the server");
  }

  return subscription;
}

export async function unsubscribeFromPush() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  await subscription?.unsubscribe();
  await fetch("/api/push/unsubscribe", { method: "POST" });
}

/**
 * Enable browser notifications.
 * Background-tab alerts need permission only (via Ably).
 * Web Push is optional (tab fully closed).
 */
export async function enableNotifications(): Promise<EnableNotificationsResult> {
  await registerServiceWorker();

  const granted = await requestNotificationPermission();
  if (!granted) {
    return {
      ok: false,
      push: false,
      message: "Notification permission denied",
    };
  }

  const hint = getPushLimitationHint();

  if (!canSubscribeToPush()) {
    return {
      ok: true,
      push: false,
      message: "Notifications enabled",
      hint,
    };
  }

  try {
    await subscribeToPush();
    return {
      ok: true,
      push: true,
      message: "Notifications enabled",
    };
  } catch {
    return {
      ok: true,
      push: false,
      message: "Notifications enabled",
      hint:
        "Background-tab alerts work. Push when the tab is closed may be blocked by your browser or network.",
    };
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
