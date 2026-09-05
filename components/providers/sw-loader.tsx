"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/push";

export default function SWLoader() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
