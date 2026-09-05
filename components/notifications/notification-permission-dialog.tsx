"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import { useCryptoStore } from "@/store/useCryptoStore";
import { enableNotifications } from "@/lib/push";
import { isNotificationSupported } from "@/lib/notifications";
import {
  dismissNotificationPrompt,
  getNotificationPermission,
  isNotificationPromptDismissed,
} from "@/lib/notification-prompt";
import { showNotificationSetupResult } from "@/lib/notification-toast";

export function NotificationPermissionDialog() {
  const privateKey = useCryptoStore((state) => state.privateKey);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!privateKey || !isNotificationSupported()) return;

    const permission = getNotificationPermission();
    if (permission === "denied") {
      setBlocked(true);
      return;
    }

    if (permission !== "default" || isNotificationPromptDismissed()) return;

    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [privateKey]);

  async function handleEnable() {
    setLoading(true);
    try {
      const result = await enableNotifications();
      if (result.ok) {
        showNotificationSetupResult(result);
        setOpen(false);
        setBlocked(false);
        return;
      }

      if (Notification.permission === "denied") {
        setBlocked(true);
      }
      showNotificationSetupResult(result);
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    dismissNotificationPrompt();
    setOpen(false);
  }

  if (!privateKey || !isNotificationSupported()) return null;

  if (blocked && Notification.permission === "denied") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications blocked</DialogTitle>
            <DialogDescription>
              Notifications are blocked in your browser. Open site settings and
              allow notifications for this site, then refresh the page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={Notification03Icon} size={24} />
          </div>
          <DialogTitle>Enable notifications?</DialogTitle>
          <DialogDescription>
            Get notified when you receive new messages, even when this tab is in
            the background.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleDismiss} disabled={loading}>
            Not now
          </Button>
          <Button onClick={handleEnable} disabled={loading}>
            {loading ? "Enabling..." : "Allow notifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
