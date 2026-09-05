import { ConversationParticipantEntry } from "@/app/actions/chat";
import { LocalMessage } from "@/app/data/chat/chat-dto";

export interface ChatMainProps {
  currentUserId: string;
  conversation: ConversationParticipantEntry;
  initialRawMessages: LocalMessage[];
}

export interface MessageActionsProps {
  isOwn: boolean;
  message: LocalMessage;
  onEditClick: (msg: LocalMessage) => void;
  onDeleteClick: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export interface MessageBubbleProps {
  message: LocalMessage;
  isUserMessage: boolean;
  name: string;
  sendingMessageIds: Set<string>;
  selectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onEditClick: (msg: LocalMessage) => void;
}
