import React, { useContext } from 'react'
import MessageBubble from './MessageBubble'
import { SelectedFriendContext } from '@/contexts/userContexts'
import { useAuth } from '@/contexts/authContext';

const MessageList = ({ messages }) => {
  const {selectedFriend} = useContext(SelectedFriendContext);
  const { user } = useAuth();
  return (
    <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
      {messages.map((msg, index) => {
        const isFirstInSequence = index === 0 || messages[index - 1].senderId !== msg.senderId;
        <MessageBubble
          key={msg.id}
          message={msg}
          isMe={user.id === selectedFriend.id}
          showAvatar = {isFirstInSequence}
          friendAvatar = {selectedFriend.avatar}
         />
      })}
    </div>
  )
}

export default MessageList
