import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useAuth } from "@/contexts/authContext";
import MessageList from "./MessageList";
import { useSocket } from "@/contexts/socketContext";
import { autofetch } from "@/lib/api";
import type { SelectedFriend } from "@/contexts/userContexts";
import { CHAT_ERROR } from "@/lib/utils";

export type ChatMessage = {
  id: number | string;
  senderId: number | string;
  avatar?: string | null;
  type: "text";
  text: string;
  timestamp: string;
  isMe: boolean;
};

interface ChatWindowProps {
  selectedFriend: SelectedFriend;
  updateLastMessage: (lastmessage: string, time: string, friend: SelectedFriend) => void;
}

export default function ChatWindow({ selectedFriend, updateLastMessage}: ChatWindowProps) {
  const Friend = selectedFriend;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socket = useSocket();
  const { user, triggerError } = useAuth();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
  }, [Friend.userid]);


  useEffect(() => {
    const fetchMessages = async () => {
      if (!hasMore && page > 1) return;
      setLoading(true);
      try {
        const response = await autofetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages?page=${page}&friendId=${Friend.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const newMessages = data.messages || [];
        if (newMessages.length < 30) 
          setHasMore(false);
        const formatedData: ChatMessage[] = newMessages.map((message: any) => ({
          id: message.message_id,
          senderId: message.sender_id,
          avatar: message.avatar,
          type: "text",
          text: message.content,
          timestamp: message.creationdate,
          isMe: String(user?.id) === String(message.sender_id),
        }));
        console.log("loaded",formatedData);

        setMessages((prev) => {
          if (page === 1) 
            return formatedData;
          const existingIds = new Set(prev.map(msg => msg.id))
          const uniqueNewMessages = formatedData.filter(msg => !existingIds.has(msg.id))
          return [...prev, ...uniqueNewMessages]
        });
      } catch (err) {
        console.log("Failed to fetch messages", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [page, Friend.id, hasMore, user?.id]);
  console.log("messages",messages);

  useEffect(() => {
    if (!socket) return;
    const handleReceive = (payload: any) => {
      setMessages((prev) => [
        {
          id: payload.msgId,
          senderId: payload.senderId,
          avatar: payload.avatar,
          type: "text",
          text: payload.content,
          timestamp: payload.sentAt,
          isMe: false,
        },
        ...prev,
      ]);
      updateLastMessage(payload.content, payload.sentAt, Friend);
    };
    socket.on("chat:receiver", handleReceive);
    socket.on("chat:error", (err: any) => {
      const message = typeof err === "string" ? err : err?.message;
      triggerError(CHAT_ERROR[message] ?? CHAT_ERROR.default);
    });
    return () => {
      socket.off("chat:receiver");
      socket.off("chat:error");
    };
  }, [socket, Friend, updateLastMessage]);

  const handleSend = (content: string) => {
    const tmpMessage: ChatMessage = {
      id: Date.now(),
      senderId: user?.id || "",
      avatar: user?.avatar || null,
      type: "text",
      text: content,
      timestamp: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages((prev) => [tmpMessage, ...prev]);
    updateLastMessage(tmpMessage.text, tmpMessage.timestamp, Friend);
    if (!socket) return;
    socket.emit("chat:send", {
      receiverId: selectedFriend.id,
      content: content,
    });
  };

  return (
    <div className="w-full flex flex-col flex-1 gap-2 rounded-lg h-full">
      <ChatHeader user={Friend} />
      <div className="flex-1 bg-[#333333]/65 rounded-lg flex flex-col overflow-hidden">
        <MessageList
          messages={messages}
          onLoadMore={() => setPage((p) => p + 1)}
          loading={loading}
          hasMore={hasMore}
        />
        <ChatInput onSend={handleSend} friend={Friend} />
      </div>
    </div>
  );
}
