"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { realtimeClient } from "@/realtime/client";
import { CHANNELS } from "@/realtime/channels";
import {
  registerServiceWorker,
  subscribeToPush,
  canSubscribeToPush,
} from "@/lib/push";
import {
  shouldShowMessageNotification,
  showBrowserNotification,
} from "@/lib/notifications";

type NotificationEventData = {
  conversationId: string;
  messageId: string;
  senderId: string;
  senderName?: string;
  preview?: string;
};

export function useNotifications(currentUserId: string) {
  const pathname = usePathname();
  const activeConversationId = pathname.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;
  const recentNotificationIds = useRef(new Set<string>());

  useEffect(() => {
    if (!currentUserId) return;

    registerServiceWorker().then(() => {
      if (Notification.permission === "granted" && canSubscribeToPush()) {
        subscribeToPush().catch(() => {
          // Background-tab notifications still work via Ably without Web Push.
        });
      }
    });
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = realtimeClient.channels.get(
      CHANNELS.USER_NOTIFICATIONS(currentUserId),
    );

    const onNotification = (msg: { data?: NotificationEventData }) => {
      const data = msg.data;
      if (!data?.conversationId || !data.messageId || !data.senderId) return;

      if (
        !shouldShowMessageNotification({
          conversationId: data.conversationId,
          senderId: data.senderId,
          currentUserId,
          activeConversationId,
        })
      ) {
        return;
      }

      if (recentNotificationIds.current.has(data.messageId)) return;
      recentNotificationIds.current.add(data.messageId);
      setTimeout(() => {
        recentNotificationIds.current.delete(data.messageId);
      }, 10_000);

      void showBrowserNotification({
        title: data.senderName || "New message",
        body: data.preview || "You have a new message",
        url: `/chat/${data.conversationId}`,
        tag: `message-${data.messageId}`,
      });
    };

    channel.subscribe("notification", onNotification);

    return () => {
      channel.unsubscribe("notification", onNotification);
    };
  }, [currentUserId, activeConversationId]);
}
