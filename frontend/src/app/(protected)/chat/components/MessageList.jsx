import React from 'react'
import MessageBubble from './MessageBubble'
import { useAuth } from '@/contexts/authContext';

const MessageList = ({ messages, onLoadMore, loading, hasMore}) => {
  const { user } = useAuth();

  return (
    <div className={`w-full flex-1 overflow-y-auto px-4 custom-scrollbar flex flex-col-reverse ${!hasMore && "py-4"}`}>
    {messages.map((msg, index) => {
        const isLastInSequence = 
          index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId;
        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={user.id === msg.senderId}
            showAvatar={isLastInSequence}
            friendAvatar={msg.avatar}
          />
        );
      })}
      {hasMore && (
        <div className='w-full mx-auto flex justify-center py-2 shrink-0'>
          <button 
            onClick={onLoadMore} 
            disabled={loading}
            className='text-xs border border-gray-400 rounded-sm px-3 py-1 text-gray-300 hover:bg-gray-700 hover:text-white transition disabled:opacity-50'
          >
            {loading ? "Loading history..." : "Load previous messages"}
          </button>
        </div>
      )}
    </div>
)
}

export default MessageList