"use client";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { useAuth } from "@/contexts/authContext";
import { useSocket } from "@/contexts/socketContext";
import { autofetch } from "@/lib/api";
import type { SelectedFriend } from "@/contexts/userContexts";
import { CHAT_ERROR } from "@/lib/utils";
import { ChatMessage } from "@/types";

interface ChatWindowProps {
  selectedFriend: SelectedFriend;
  updateLastMessage: (lastmessage: string, time: string, friend: SelectedFriend) => void;
  liveMessages: ChatMessage[];
  clearLiveMessages: () => void;
}

export default function ChatWindow({selectedFriend, updateLastMessage, liveMessages, clearLiveMessages}: ChatWindowProps) {
  const Friend = selectedFriend;
  const friendRef = useRef(Friend);
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
  }, [Friend.id]);

  useEffect(() => {
    friendRef.current = Friend;
  }, [Friend]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!hasMore && page > 1) 
        return;

      setLoading(true);
      try {
        const response = await autofetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages?page=${page}&friendId=${Friend.id}`,
          { method: "GET", credentials: "include" }
        );

        const data = await response.json();
        if (!response.ok) 
          throw new Error(data.error);

        const newMessages = data.messages || [];
        if (newMessages.length < 30) 
          setHasMore(false);

        console.log(newMessages);
        const formatedData: ChatMessage[] = newMessages.map((message: any) => ({
          id: message.message_id,
          senderId: message.sender_id,
          avatar: message.avatar,
          type: message.type,
          text: message.content,
          timestamp: message.creationdate,
          isMe: String(user?.id) === String(message.sender_id),
        }));
        
        setMessages((prev) => {
          if (page === 1) 
            return formatedData;

          const existingIds = new Set(prev.map((m) => String(m.id)));
          const unique = formatedData.filter((m) => !existingIds.has(String(m.id)));
          return [...prev, ...unique];
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

  useEffect(() => {
    if (!liveMessages || liveMessages.length === 0) 
      return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => String(m.id)));
      const unique = liveMessages.filter((m) => !existingIds.has(String(m.id)));
      return [...unique, ...prev];
    });

    clearLiveMessages();
  }, [liveMessages, clearLiveMessages]);

  useEffect(() => {
    if (!socket) 
      return;

    const onError = (err: any) => {
			console.log(err);
      const message = typeof err === "string" ? err : err?.message;
      const now = new Date();

      setMessages((prev) => {
        if (prev.length === 0)
          return prev;
        return prev.slice(1);
      });
      const currentFriend = friendRef.current;
      updateLastMessage("Error", now.toISOString() , currentFriend);
      triggerError(CHAT_ERROR[message] ?? CHAT_ERROR.default);
    };

    socket.on("chat:error", onError);
    return () => {
      socket.off("chat:error", onError);
    };
  }, [socket, triggerError, updateLastMessage]);

  const handleSend = (content: string, type: string) => {
    const now = new Date();

    if(content.length > 500){
      triggerError(CHAT_ERROR["MESSAGE_TOO_LONG"])
      return
    }

    const tmpMessage: ChatMessage = {
      id: `tmp-${now.getTime()}`,
      senderId: user?.id || "",
      receiverId: selectedFriend.id,
      avatar: user?.avatar || null,
      type: type,
      text: content,
      timestamp: now.toISOString(),
      isMe: true,
    };
    setMessages((prev) => [tmpMessage, ...prev]);
    updateLastMessage(tmpMessage.text, tmpMessage.timestamp, Friend);

    if (!socket) 
      return;
    socket.emit("chat:send", {
      receiverId: Friend.id,
      type: type,
      content,
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
