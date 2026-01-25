import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { useAuth } from '@/contexts/authContext';

const MessageList = ({ messages, lastElementObs }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest",
     });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-500
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-[#0F0F0FA6]"
    >
      {messages.map((msg, index) => {
        const isFirstInSequence =
          index === 0 || messages[index - 1].senderId !== msg.senderId;
        if (index == 0){
          return (
            <MessageBubble ref={lastElementObs}
            key={msg.id}
            message={msg}
            isMe={user.id == msg.senderId}
            showAvatar={isFirstInSequence}
            friendAvatar={msg.avatar}
            />
          );
        } else {
            return (
              <MessageBubble
              key={msg.id}
              message={msg}
              isMe={user.id == msg.senderId}
              showAvatar={isFirstInSequence}
              friendAvatar={msg.avatar}
              />
          );
        }
      })}
      <div ref={bottomRef} />
    </div>
)
}

export default MessageList

  //to prevent jump probleme to fixe it later
  // const containerRef = useRef(null);
  
  // // Helper to detect if we just loaded "history" (added items to top)
  // const prevMessagesLength = useRef(0);

  // // Use useLayoutEffect to prevent visual "jumps"
  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   // Case 1: Initial Load (0 -> 10 items) or New Message sent/received
  //   // Logic: If the NEW length is significantly larger (page load) OR just +1 (chatting)
  //   // But we need to distinguish "Page 2" from "New Message".
    
  //   // Simplest approach: Auto-scroll ONLY if we are near the bottom 
  //   // OR if it's the very first load.
    
  //   const isFirstLoad = prevMessagesLength.current === 0 && messages.length > 0;
  //   const isNewMessage = messages.length === prevMessagesLength.current + 1; // User sent one msg
    
  //   if (isFirstLoad || isNewMessage) {
  //      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //   } 
  //   // Case 2: We loaded history (Page 2).
  //   // The browser usually handles "scroll anchoring" automatically now, 
  //   // keeping the user looking at the same message even if items are added above.
  //   // So we usually DON'T need to do anything here.
    
  //   // Update ref for next render
  //   prevMessagesLength.current = messages.length;
    
  // }, [messages]);