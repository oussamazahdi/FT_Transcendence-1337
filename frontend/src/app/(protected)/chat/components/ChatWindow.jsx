import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import MessageBubble from "./MessageBubble";
import { messages as initialMessages } from "@/assets/mocData"
import { useAuth } from '@/contexts/authContext';


export default function ChatWindow({selectedFriend}) {
  const Friend = selectedFriend;
  const [messages, setMessages] = useState(initialMessages);
  const { user } = useAuth();
  const bottomRef = useRef(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full flex flex-col flex-1 gap-2 rounded-lg h-full">
      <ChatHeader user={Friend}/>
      <div className="flex-1 bg-[#8D8D8D]/25 rounded-lg flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-500
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#0F0F0FA6]">
          {messages.map((msg, index) => {
            const isFirstInSequence = index === 0 || messages[index - 1].senderId !== msg.senderId;
            return(
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={user.id == msg.senderId}
                showAvatar = {isFirstInSequence}
                friendAvatar = {Friend.avatar}
              />
            )
      })}
        <div ref={bottomRef} />
        </div>
        <ChatInput messages={messages} setMessages={setMessages}/>
      </div>
    </div>
  )  
}
