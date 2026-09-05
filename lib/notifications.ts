"use client";

export type BrowserNotificationPayload = {
  title: string;
  body: string;
  url: string;
  tag?: string;
};

export function isNotificationSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export function shouldShowMessageNotification({
  conversationId,
  senderId,
  currentUserId,
  activeConversationId,
}: {
  conversationId: string;
  senderId: string;
  currentUserId: string;
  activeConversationId?: string | null;
}) {
  if (senderId === currentUserId) return false;

  const isViewingConversation =
    activeConversationId === conversationId &&
    document.hasFocus() &&
    !document.hidden;

  return !isViewingConversation;
}

export async function showBrowserNotification(
  payload: BrowserNotificationPayload,
) {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification(payload.title, {
    body: payload.body,
    icon: "/icon.png",
    badge: "/icon.png",
    tag: payload.tag,
    data: {
      url: payload.url,
    },
  } as NotificationOptions & { renotify?: boolean });
}
