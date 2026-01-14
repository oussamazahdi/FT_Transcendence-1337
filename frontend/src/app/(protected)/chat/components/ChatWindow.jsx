import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { messages as initialMessages } from "@/assets/mocData";
import { useAuth } from "@/contexts/authContext";
import MessageList from "./MessageList";

export default function ChatWindow({ selectedFriend }) {
  const Friend = selectedFriend;
  const [messages, setMessages] = useState(initialMessages);

  return (
    <div className="w-full flex flex-col flex-1 gap-2 rounded-lg h-full">
      <ChatHeader user={Friend} />
      <div className="flex-1 bg-[#333333]/65 rounded-lg flex flex-col overflow-hidden">
        <MessageList messages={messages} />
        <ChatInput messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}
