"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import { enableNotifications } from "@/lib/push";
import { isNotificationSupported } from "@/lib/notifications";
import { getNotificationPermission } from "@/lib/notification-prompt";
import { showNotificationSetupResult } from "@/lib/notification-toast";

export function NotificationPermissionBanner() {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNotificationSupported()) return;
    setPermission(getNotificationPermission());
  }, []);

  if (!isNotificationSupported() || permission === "granted") return null;

  async function handleEnable() {
    setLoading(true);
    try {
      const result = await enableNotifications();
      setPermission(Notification.permission);
      showNotificationSetupResult(result);
    } finally {
      setLoading(false);
    }
  }

  if (permission === "denied") {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
          Notifications blocked
        </p>
        <p className="text-xs text-muted-foreground">
          Allow notifications from your browser&apos;s site settings, then
          refresh this page.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
      <div className="flex items-start gap-2">
        <HugeiconsIcon icon={Notification03Icon} size={18} className="mt-0.5" />
        <div>
          <p className="text-sm font-medium">Enable notifications</p>
          <p className="text-xs text-muted-foreground">
            Get alerts when this tab is in the background.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        className="w-full"
        onClick={handleEnable}
        disabled={loading}
      >
        {loading ? "Enabling..." : "Allow notifications"}
      </Button>
    </div>
  );
}
