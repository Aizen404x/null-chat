"use client";

import { useState, useEffect } from "react";
import { enableNotifications, registerServiceWorker } from "@/lib/push";
import { isNotificationSupported } from "@/lib/notifications";
import { clearNotificationPromptDismissal } from "@/lib/notification-prompt";
import { Button } from "@/components/ui/button";
import { showNotificationSetupResult } from "@/lib/notification-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification03Icon,
  NotificationOff01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNotificationSupported()) return;

    setIsSupported(true);
    setPermission(Notification.permission);
    registerServiceWorker();
  }, []);

  async function subscribeToPushNotifications() {
    setLoading(true);
    try {
      clearNotificationPromptDismissal();
      const result = await enableNotifications();
      setPermission(Notification.permission);
      showNotificationSetupResult(result);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPushNotifications() {
    setLoading(true);
    try {
      const { unsubscribeFromPush } = await import("@/lib/push");
      await unsubscribeFromPush();
      setPermission(Notification.permission);
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
          <HugeiconsIcon icon={Alert01Icon} size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            Not Supported
          </p>
          <p className="mt-0.5 text-sm text-amber-700/70 dark:text-amber-500/70">
            Push notifications are not supported in this browser.
          </p>
        </div>
      </div>
    );
  }

  if (permission === "granted") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
            <HugeiconsIcon icon={Notification03Icon} size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Notifications Enabled
            </p>
            <p className="mt-0.5 text-sm text-green-700/70 dark:text-green-500/70">
              You&apos;ll receive alerts for new messages.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={unsubscribeFromPushNotifications}
          disabled={loading}
          className="w-fit gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
        >
          <HugeiconsIcon icon={NotificationOff01Icon} size={16} />
          {loading ? "Disabling..." : "Disable Notifications"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-muted bg-muted/30 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <HugeiconsIcon icon={NotificationOff01Icon} size={18} />
        </div>
        <div>
          <p className="text-sm font-medium">Notifications Disabled</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Enable notifications to stay updated on new messages.
          </p>
        </div>
      </div>

      <Button
        onClick={subscribeToPushNotifications}
        disabled={loading || permission === "denied"}
        className="w-fit gap-2"
      >
        <HugeiconsIcon icon={Notification03Icon} size={16} />
        {loading
          ? "Enabling..."
          : permission === "denied"
            ? "Blocked in browser settings"
            : "Enable Notifications"}
      </Button>
    </div>
  );
}

export default PushNotificationManager;
