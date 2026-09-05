"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLongPress } from "@/hooks/long-press";
import { Spinner } from "@/components/ui/spinner";
import { MessageActions } from "./message-actions";
import type { MessageBubbleProps } from "./types";

export function MessageBubble({
  message,
  isUserMessage,
  name,
  sendingMessageIds,
  selectionMode,
  isSelected,
  onSelect,
  onDeleteClick,
  onEditClick,
}: MessageBubbleProps) {
  const [hovered, setHovered] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const longPressHandlers = useLongPress(() => {
    if (!selectionMode) {
      setActionsOpen(true);
    }
  });

  const bubbleClasses = cn(
    "w-full rounded-2xl px-4 py-2.5 select-none",
    isUserMessage
      ? "bg-primary text-primary-foreground rounded-br-sm"
      : "bg-muted rounded-bl-sm",
  );

  return (
    <div
      className={cn(
        "flex items-start gap-2 group rounded-lg px-1 transition",
        isUserMessage ? "justify-end" : "justify-start",
        selectionMode && "cursor-pointer",
        selectionMode && isSelected && "bg-muted/40 py-2",
      )}
      {...longPressHandlers}
      onClick={(e) => {
        longPressHandlers.onClick(e);
        if (selectionMode) onSelect(message.id);
      }}
      onTouchStart={(e) => {
        if (actionsOpen) return;
        longPressHandlers.onTouchStart(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isUserMessage && (
        <Avatar className="h-8 w-8 shrink-0 self-end">
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex items-end gap-1 flex-row-reverse")}>
        {!selectionMode && (
          <div
            className={cn(
              "transition-opacity duration-150",
              hovered ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <MessageActions
              isOwn={isUserMessage}
              message={message}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              open={actionsOpen}
              setOpen={setActionsOpen}
            />
          </div>
        )}

        <div className="flex flex-col items-end">
          <div className={bubbleClasses}>
            {message.deletedAt ? (
              <p className="text-sm italic opacity-70">message deleted</p>
            ) : (
              <>
                <p className="text-sm">{message.content}</p>

                {message.editedAt && (
                  <p className="mt-1 text-[10px] opacity-60">edited</p>
                )}
              </>
            )}
          </div>

          {sendingMessageIds.has(message.id) ? (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Spinner className="size-3" />
              <span>Sending...</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
