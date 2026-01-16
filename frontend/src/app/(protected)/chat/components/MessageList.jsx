import React, { useContext, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { SelectedFriendContext } from '@/contexts/userContexts'
import { useAuth } from '@/contexts/authContext';

const MessageList = ({ messages }) => {
  const {selectedFriend} = useContext(SelectedFriendContext);
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
      [&::-webkit-scrollbar-thumb]:bg-[#0F0F0FA6]
			custom-scrollbar"
    >
      {messages.map((msg, index) => {
        const isFirstInSequence =
          index === 0 || messages[index - 1].senderId !== msg.senderId;
        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={user.id == msg.senderId}
            showAvatar={isFirstInSequence}
            friendAvatar={selectedFriend.avatar}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
)
}

export default MessageList
