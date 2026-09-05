"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface EditMessageDialogProps {
  open: boolean;
  editText: string;
  onOpenChange: (open: boolean) => void;
  onEditTextChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function EditMessageDialog({
  open,
  editText,
  onOpenChange,
  onEditTextChange,
  onCancel,
  onSubmit,
}: EditMessageDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Textarea
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          placeholder="Edit your message..."
          className="min-h-[100px] resize-none"
        />
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" onClick={onCancel} />}
          >
            Cancel
          </DialogClose>
          <Button onClick={onSubmit} disabled={!editText.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
