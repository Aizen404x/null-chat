"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown01Icon,
  Copy01Icon,
  Delete01Icon,
  Edit01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { MessageActionsProps } from "./types";

export function MessageActions({
  isOwn,
  message,
  onEditClick,
  onDeleteClick,
  open,
  setOpen,
}: MessageActionsProps) {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
          />
        }
      >
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className="h-3.5 w-3.5 text-muted-foreground"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isOwn ? "end" : "start"}
        className="min-w-[120px]"
      >
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(message.content || "");
            setOpen(false);
          }}
        >
          <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" />
          Copy
        </DropdownMenuItem>

        {isOwn && (
          <>
            <DropdownMenuItem
              onClick={() => {
                onEditClick(message);
                setOpen(false);
              }}
            >
              <HugeiconsIcon icon={Edit01Icon} className="h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                onDeleteClick(message.id);
                setOpen(false);
              }}
              className="text-destructive"
            >
              <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
