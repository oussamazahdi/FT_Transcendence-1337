import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { messages as initialMessages } from "@/assets/mocData";
import { useAuth } from "@/contexts/authContext";
import MessageList from "./MessageList";
import { useSocket } from "@/contexts/socketContext";

export default function ChatWindow({ selectedFriend }) {
  const Friend = selectedFriend;
  const [messages, setMessages] = useState(initialMessages);
  const socket = useSocket();
  const {user} = useAuth()

  useEffect(() => {
    if (!socket)
      return
    if (!socket.connected) 
      socket.connect();

    socket.on("chat:receiver", (payload) => {
      console.log("New message received:", payload);
      setMessages((prev) => [...prev, {
        id: messages.length + 1,
        senderId: payload.senderId,
        avatar: payload.avatar,
        type: "text",
        text: payload.content,
        timestamp : payload.sentAt,
        isMe: false,
      }])
    })

    socket.on("chat:error", (err) => console.log(err.message));

    return () => {
      socket.off("chat:receiver");
      socket.off("chat:error");
    };
  },[socket])

  const handleSend = (content) => {
    const tmpMessage = {
      id: messages.length + 1,
      senderId : user.id,
      type: "text",
      text: content,
      timestamp:new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    }

    setMessages((prev) => [...prev, tmpMessage])
    socket.emit('chat:send', {
      receiverId: selectedFriend.id,
      content: content
    })
  }

  return (
    <div className="w-full flex flex-col flex-1 gap-2 rounded-lg h-full">
      <ChatHeader user={Friend} />
      <div className="flex-1 bg-[#333333]/65 rounded-lg flex flex-col overflow-hidden">
        <MessageList messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
