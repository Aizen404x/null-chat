"use client";

import { useCryptoStore } from "@/store/useCryptoStore";
import UnlockPrivateKeyModal from "@/components/chat/unlock-private-key";
import { cn } from "@/lib/utils";

interface ChatGateProps {
  sidebar: React.ReactNode;
  notifications: React.ReactNode;
  children: React.ReactNode;
}

export function ChatGate({ sidebar, notifications, children }: ChatGateProps) {
  const privateKey = useCryptoStore((state) => state.privateKey);

  if (privateKey === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <UnlockPrivateKeyModal open onOpenChange={() => {}} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {notifications}
      {sidebar}
      <div
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-0",
          "flex-1",
        )}
      >
        {children}
      </div>
    </div>
  );
}
