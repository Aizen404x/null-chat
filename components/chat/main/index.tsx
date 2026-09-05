"use client";

import { ChatHeader } from "./chat-header";
import { RemoveConversationDialog } from "./remove-conversation-dialog";
import { ChatMessagesList } from "./chat-messages-list";
import { ChatInputForm } from "./chat-input-form";
import { EditMessageDialog } from "./edit-message-dialog";
import { useChatMain } from "./use-chat-main";
import type { ChatMainProps } from "./types";

export function ChatMain(props: ChatMainProps) {
  const chat = useChatMain(props);

  return (
    <>
      <ChatHeader
        selectionMode={chat.selectionMode}
        selectedIds={chat.selectedIds}
        chatUserName={chat.chatUserName}
        onExitSelection={chat.exitSelectionMode}
        onSelectAll={chat.handleSelectAll}
        onDeleteSelected={chat.handleDeleteSelected}
        onBack={() => chat.router.push("/chat")}
        onRemoveConversation={() => chat.setRemoveConversationOpen(true)}
      />

      <RemoveConversationDialog
        open={chat.removeConversationOpen}
        onOpenChange={chat.setRemoveConversationOpen}
        onConfirm={chat.handleConfirmDelete}
      />

      <ChatMessagesList
        scrollContainerRef={chat.scrollContainerRef}
        localMessages={chat.localMessages}
        currentUserId={chat.currentUserId}
        opponentName={chat.opponentName}
        sendingMessageIds={chat.sendingMessagesIds}
        selectionMode={chat.selectionMode}
        selectedIds={chat.selectedIds}
        hasMore={chat.hasMoreMap[chat.conversationId] ?? false}
        loadingOlder={chat.loadingOlderMap[chat.conversationId] || false}
        onScroll={chat.handleScroll}
        onLoadOlder={chat.loadOlderMessages}
        onToggleSelect={chat.toggleSelect}
        onDropdownDelete={chat.handleDropdownDelete}
        onEditClick={chat.handleEditClick}
      />

      <ChatInputForm
        text={chat.text}
        selectionMode={chat.selectionMode}
        onTextChange={chat.setText}
        onSubmit={chat.handleSend}
      />

      <EditMessageDialog
        open={chat.editDialogOpen}
        editText={chat.editText}
        onOpenChange={chat.setEditDialogOpen}
        onEditTextChange={chat.setEditText}
        onCancel={chat.handleEditCancel}
        onSubmit={chat.handleEditSubmit}
      />
    </>
  );
}

export type { ChatMainProps } from "./types";
