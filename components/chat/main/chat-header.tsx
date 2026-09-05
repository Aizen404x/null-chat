"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Cancel01Icon,
  Delete01Icon,
  MoreVertical,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ChatHeaderProps {
  selectionMode: boolean;
  selectedIds: Set<string>;
  chatUserName: string;
  onExitSelection: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onBack: () => void;
  onRemoveConversation: () => void;
}

export function ChatHeader({
  selectionMode,
  selectedIds,
  chatUserName,
  onExitSelection,
  onSelectAll,
  onDeleteSelected,
  onBack,
  onRemoveConversation,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4 shrink-0">
      {selectionMode ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onExitSelection}>
              <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-sm">
              {selectedIds.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={onSelectAll}
            >
              Select all
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 h-8"
              disabled={selectedIds.size === 0}
              onClick={onDeleteSelected}
            >
              <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
              Delete ({selectedIds.size})
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0 md:hidden"
            >
              <HugeiconsIcon icon={ArrowLeft} className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {chatUserName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="font-semibold truncate max-w-[160px] sm:max-w-[250px]">
                {chatUserName}
              </h2>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <HugeiconsIcon icon={MoreVertical} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onRemoveConversation}>
                Remove conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
