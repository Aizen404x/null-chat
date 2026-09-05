"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  getMessagesAction,
  updateReadStatusAction,
} from "@/app/actions/chat";
import { resolveConversationTitle } from "@/lib/utilites";
import { useChatChannel } from "@/realtime/use-channel";
import { CHANNELS } from "@/realtime/channels";
import { deriveSharedSecret } from "@/lib/crypto/exchange";
import { decryptData } from "@/lib/crypto/decrypt";
import { base64ToBuffer } from "@/lib/crypto/encoding";
import { useMessagesStore } from "@/store/useMessagesStore";
import { LocalMessage } from "@/app/data/chat/chat-dto";
import { useCryptoStore } from "@/store/useCryptoStore";
import type { ChatMainProps } from "./types";

export function useChatMain({
  currentUserId,
  conversation,
  initialRawMessages,
}: ChatMainProps) {
  const privateKey = useCryptoStore((state) => state.privateKey);
  const displayName = useCryptoStore((state) => state.displayName);
  const router = useRouter();

  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingMessagesIds, setSendingMessagesIds] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [loadingOlderMap, setLoadingOlderMap] = useState<
    Record<string, boolean>
  >({});
  const [hasMoreMap, setHasMoreMap] = useState<Record<string, boolean>>({});

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [removeConversationOpen, setRemoveConversationOpen] = useState(false);

  const {
    setMessages,
    getMessages,
    addMessage,
    updateMessage,
    deleteConversation: deleteConversationStore,
  } = useMessagesStore();

  const opponent = conversation.conversation.participants.find(
    (p) => p.userId !== currentUserId,
  );
  const opponentPublicKey = opponent?.user.publicKey;

  const getSharedKey = useCallback(async () => {
    if (!privateKey || !opponentPublicKey) throw new Error("Missing keys");
    return await deriveSharedSecret(privateKey, opponentPublicKey);
  }, [privateKey, opponentPublicKey]);

  useEffect(() => {
    let mounted = true;
    async function loadMessages() {
      let msgs: LocalMessage[];
      if (initialRawMessages) {
        msgs = initialRawMessages;
      } else {
        msgs = await getMessagesAction(conversation.conversation.id);
      }
      if (!privateKey || !opponentPublicKey) return;
      const sharedKey = await getSharedKey();

      const decrypted = await Promise.all(
        msgs.map(async (msg) => {
          try {
            const content = await decryptData(
              base64ToBuffer(msg.content!),
              sharedKey,
              new Uint8Array(base64ToBuffer(msg.iv!)),
            );
            return { ...msg, content: content as string };
          } catch {
            return null;
          }
        }),
      );
      const filtered = decrypted.filter(
        (m): m is NonNullable<typeof m> => m !== null,
      );

      if (mounted) {
        setLocalMessages(filtered as LocalMessage[]);
        setTimeout(
          () => setMessages(conversation.conversation.id, filtered),
          0,
        );
        setHasMoreMap((prev) => ({
          ...prev,
          [conversation.conversation.id]: initialRawMessages
            ? filtered.length === 20
            : filtered.length === 15,
        }));
      }
    }
    loadMessages();
    return () => {
      mounted = false;
    };
  }, [
    conversation.conversation.id,
    privateKey,
    opponentPublicKey,
    initialRawMessages,
  ]);

  const loadOlderMessages = async () => {
    const isLoading = loadingOlderMap[conversation.conversation.id] || false;
    const hasMore = hasMoreMap[conversation.conversation.id] ?? true;
    if (isLoading || !hasMore || localMessages.length === 0) return;

    setLoadingOlderMap((prev) => ({
      ...prev,
      [conversation.conversation.id]: true,
    }));
    try {
      const oldest = localMessages[0];
      const olderMsgs = await getMessagesAction(
        conversation.conversation.id,
        oldest.id,
      );
      if (!privateKey || !opponentPublicKey) return;
      const sharedKey = await getSharedKey();

      const decrypted = await Promise.all(
        olderMsgs.map(async (msg) => {
          try {
            const content = await decryptData(
              base64ToBuffer(msg.content!),
              sharedKey,
              new Uint8Array(base64ToBuffer(msg.iv!)),
            );
            return { ...msg, content: content as string };
          } catch {
            return null;
          }
        }),
      );
      const filtered = decrypted.filter(
        (m): m is NonNullable<typeof m> => m !== null,
      );

      if (filtered.length === 0) {
        setHasMoreMap((prev) => ({
          ...prev,
          [conversation.conversation.id]: false,
        }));
      } else {
        const scrollContainer = scrollContainerRef.current;
        const scrollHeight = scrollContainer?.scrollHeight;
        const scrollTop = scrollContainer?.scrollTop;

        setLocalMessages((prev) => [...(filtered as LocalMessage[]), ...prev]);

        const currentCached = getMessages(conversation.conversation.id) || [];
        const newCached = [...filtered, ...currentCached];
        setTimeout(
          () => setMessages(conversation.conversation.id, newCached),
          0,
        );
        setTimeout(() => {
          if (scrollContainer && scrollHeight && scrollTop != null) {
            scrollContainer.scrollTop =
              scrollTop + (scrollContainer.scrollHeight - scrollHeight);
          }
        }, 0);
      }
    } catch (err) {
      console.error("Error loading older messages:", err);
    } finally {
      setLoadingOlderMap((prev) => ({
        ...prev,
        [conversation.conversation.id]: false,
      }));
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0) loadOlderMessages();
  };

  const lastReadRef = useRef<string | null>(conversation.lastReadMessageId);
  useEffect(() => {
    if (!localMessages.length) return;
    const last = localMessages[localMessages.length - 1];
    if (last.senderId === currentUserId) return;
    if (lastReadRef.current === last.id) return;
    if (!document.hasFocus()) return;
    lastReadRef.current = last.id;
    updateReadStatusAction(conversation.conversation.id, last.id);
  }, [localMessages]);

  const opponentUserIds = conversation.conversation.participants
    .filter((p) => p.userId !== currentUserId)
    .map((p) => p.userId);

  const { sendMessage, editMessage, deleteMessage, deleteConversation } =
    useChatChannel({
      channelName: CHANNELS.CHAT(conversation.conversation.id),
      privateKey,
      opponentPublicKey: opponentPublicKey!,
      onMessage: (msg) => {
        if (msg.type === "send") {
          const safeMsg: LocalMessage = {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            createdAt:
              msg.createdAt && !isNaN(Date.parse(msg.createdAt))
                ? msg.createdAt
                : new Date().toISOString(),
            ...msg,
          };
          addMessage(conversation.conversation.id, safeMsg);
          setLocalMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, safeMsg];
          });
        } else if (msg.type === "edit") {
          updateMessage(conversation.conversation.id, msg.id, {
            content: msg.content,
            editedAt: msg.editedAt,
          });

          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === msg.id
                ? { ...m, content: msg.content, editedAt: msg.editedAt }
                : m,
            ),
          );

          return;
        } else if (msg.type === "delete") {
          const messageIds = msg.data as string[];
          for (const id of messageIds) {
            updateMessage(conversation.conversation.id, id, {
              deletedAt: new Date(),
            });
          }
          setLocalMessages((prev) =>
            prev.map((m) =>
              messageIds.includes(m.id) ? { ...m, deletedAt: new Date() } : m,
            ),
          );
          return;
        } else if (msg.name === "conversation:delete") {
          deleteConversationStore(conversation.conversation.id);
          router.push("/chat");
          return;
        }
      },
      currentUserId,
      opponentUserIds,
      senderDisplayName: displayName,
    });

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || localMessages.length === 0) return;
    container.scrollTop = container.scrollHeight;
  }, [localMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    const messageId = crypto.randomUUID();
    try {
      const newMessage: LocalMessage = {
        id: messageId,
        content: text,
        senderId: currentUserId,
        conversationId: conversation.conversation.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "text",
        iv: null,
        replyToMessageId: null,
        editedAt: null,
        deletedAt: null,
      };

      setSendingMessagesIds((prev) => new Set([...prev, messageId]));
      addMessage(conversation.conversation.id, newMessage);
      setLocalMessages((prev: LocalMessage[]) => {
        const updated = [...prev, newMessage];
        setTimeout(() => setMessages(conversation.conversation.id, updated), 0);
        return updated;
      });
      setText("");
      await sendMessage(newMessage);
    } finally {
      setSending(false);
      setSendingMessagesIds((prev) => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
    }
  };

  const enterSelectionMode = (messageId: string) => {
    setSelectionMode(true);
    setSelectedIds(new Set([messageId]));
    setEditingMessageId(null);
    setEditText("");
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDropdownDelete = (messageId: string) => {
    enterSelectionMode(messageId);
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const now = new Date();

    setLocalMessages((prev) =>
      prev.map((m) => (selectedIds.has(m.id) ? { ...m, deletedAt: now } : m)),
    );
    const cached = getMessages(conversation.conversation.id) || [];
    setMessages(
      conversation.conversation.id,
      cached.map((m) => (selectedIds.has(m.id) ? { ...m, deletedAt: now } : m)),
    );

    exitSelectionMode();
    await deleteMessage(ids);
  };

  const handleEditClick = (msg: LocalMessage) => {
    setEditingMessageId(msg.id);
    setEditText(msg.content || "");
    setEditDialogOpen(true);
    exitSelectionMode();
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditText("");
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async () => {
    if (!editText.trim() || !editingMessageId) return;

    const messageId = editingMessageId;
    const newContent = editText.trim();

    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, content: newContent, editedAt: new Date() }
          : m,
      ),
    );
    const cached = getMessages(conversation.conversation.id) || [];
    setMessages(
      conversation.conversation.id,
      cached.map((m) =>
        m.id === messageId
          ? { ...m, content: newContent, editedAt: new Date() }
          : m,
      ),
    );

    setEditingMessageId(null);
    setEditText("");

    try {
      await editMessage({
        id: messageId,
        content: newContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "text",
        senderId: currentUserId,
        conversationId: conversation.conversation.id,
        editedAt: new Date(),
        iv: null,
        replyToMessageId: null,
        deletedAt: null,
      });
    } catch (err) {
      console.error("Edit failed:", err);
    }
    setEditDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deleteConversation(conversation.conversation.id);
  };

  const chatUserName =
    resolveConversationTitle(conversation, currentUserId) || "Unknown";

  const opponentName =
    resolveConversationTitle(conversation, currentUserId) || "Unknown";

  const handleSelectAll = () => {
    const ownIds = localMessages
      .filter((m) => m.senderId === currentUserId)
      .map((m) => m.id);
    setSelectedIds(new Set(ownIds));
  };

  return {
    scrollContainerRef,
    localMessages,
    text,
    sendingMessagesIds,
    selectionMode,
    selectedIds,
    editText,
    editDialogOpen,
    removeConversationOpen,
    hasMoreMap,
    loadingOlderMap,
    conversationId: conversation.conversation.id,
    chatUserName,
    opponentName,
    currentUserId,
    setText,
    setEditDialogOpen,
    setEditText,
    setRemoveConversationOpen,
    handleScroll,
    handleSend,
    exitSelectionMode,
    handleSelectAll,
    handleDeleteSelected,
    handleDropdownDelete,
    handleEditClick,
    handleEditCancel,
    handleEditSubmit,
    handleConfirmDelete,
    loadOlderMessages,
    toggleSelect,
    router,
  };
}
