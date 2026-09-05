import { ChatSidebar } from "@/components/chat/sidebar";
import { ChatDal } from "@/app/data/chat/chat-dal";
import { NotificationManager } from "@/components/notifications/notification-manager";
import { ChatGate } from "@/components/chat/chat-gate";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chatDal = await ChatDal.create();
  const conversations = await chatDal.getMyConversations();
  const user = chatDal.getCurrentUser();

  return (
    <ChatGate
      notifications={<NotificationManager userId={user.id} />}
      sidebar={
        <ChatSidebar currentUserId={user.id} conversations={conversations} />
      }
    >
      {children}
    </ChatGate>
  );
}
