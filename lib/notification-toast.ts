"use client";

import { toast } from "sonner";
import type { EnableNotificationsResult } from "@/lib/push";

export function showNotificationSetupResult(result: EnableNotificationsResult) {
  if (result.ok) {
    toast.success(result.message);
    if (result.hint) {
      toast.info(result.hint, { duration: 6000 });
    }
    return;
  }

  toast.error(result.message);
}
