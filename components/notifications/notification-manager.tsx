"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { NotificationPermissionDialog } from "@/components/notifications/notification-permission-dialog";

export function NotificationManager({ userId }: { userId: string }) {
  useNotifications(userId);

  return <NotificationPermissionDialog />;
}
