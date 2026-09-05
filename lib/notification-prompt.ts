"use client";

const DISMISS_KEY = "nullchat-notifications-dismissed";

export function isNotificationPromptDismissed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DISMISS_KEY) === "true";
}

export function dismissNotificationPrompt() {
  localStorage.setItem(DISMISS_KEY, "true");
}

export function clearNotificationPromptDismissal() {
  localStorage.removeItem(DISMISS_KEY);
}

export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  return Notification.permission;
}
