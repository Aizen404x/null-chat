"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ImageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ChatInputFormProps {
  text: string;
  selectionMode: boolean;
  onTextChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ChatInputForm({
  text,
  selectionMode,
  onTextChange,
  onSubmit,
}: ChatInputFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 border-t p-4 shrink-0"
    >
      <HugeiconsIcon
        icon={ImageIcon}
        className="text-muted-foreground h-5 w-5 cursor-pointer shrink-0"
      />
      <Input
        placeholder={
          selectionMode
            ? "Exit selection to send messages..."
            : "Enter a message..."
        }
        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted h-10"
        value={text}
        autoComplete="off"
        disabled={selectionMode}
        onChange={(e) => onTextChange(e.target.value)}
      />
      <Button
        size="icon"
        className="rounded-full shrink-0"
        type="submit"
        disabled={selectionMode || !text.trim()}
      >
        <HugeiconsIcon icon={ArrowRight} />
      </Button>
    </form>
  );
}
