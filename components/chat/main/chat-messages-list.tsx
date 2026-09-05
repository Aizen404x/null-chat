"use client";

import { RefObject, UIEvent } from "react";
import { Button } from "@/components/ui/button";
import { LocalMessage } from "@/app/data/chat/chat-dto";
import { MessageBubble } from "./message-bubble";

interface ChatMessagesListProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  localMessages: LocalMessage[];
  currentUserId: string;
  opponentName: string;
  sendingMessageIds: Set<string>;
  selectionMode: boolean;
  selectedIds: Set<string>;
  hasMore: boolean;
  loadingOlder: boolean;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
  onLoadOlder: () => void;
  onToggleSelect: (id: string) => void;
  onDropdownDelete: (messageId: string) => void;
  onEditClick: (msg: LocalMessage) => void;
}

export function ChatMessagesList({
  scrollContainerRef,
  localMessages,
  currentUserId,
  opponentName,
  sendingMessageIds,
  selectionMode,
  selectedIds,
  hasMore,
  loadingOlder,
  onScroll,
  onLoadOlder,
  onToggleSelect,
  onDropdownDelete,
  onEditClick,
}: ChatMessagesListProps) {
  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex-1 space-y-1 overflow-y-scroll p-4 relative"
    >
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadOlder}
            disabled={loadingOlder}
          >
            {loadingOlder ? "Loading..." : "Load Older Messages"}
          </Button>
        </div>
      )}

      {localMessages.length > 0 ? (
        localMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            name={opponentName}
            isUserMessage={msg.senderId === currentUserId}
            sendingMessageIds={sendingMessageIds}
            selectionMode={selectionMode}
            isSelected={selectedIds.has(msg.id)}
            onSelect={(id) => {
              if (msg.senderId === currentUserId) onToggleSelect(id);
            }}
            onDeleteClick={onDropdownDelete}
            onEditClick={onEditClick}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No messages yet</p>
        </div>
      )}
    </div>
  );
}
