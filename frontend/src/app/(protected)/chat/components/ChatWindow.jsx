import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useAuth } from "@/contexts/authContext";
import MessageList from "./MessageList";
import { useSocket } from "@/contexts/socketContext";

export default function ChatWindow({ selectedFriend }) {
  const Friend = selectedFriend;
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const {user} = useAuth()

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
  }, [Friend.userid]);


  useEffect(()=>{
    
    const fetchMessages = async () => {
      if (!hasMore && page > 1)
        return;
      setLoading(true)
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages?page=${page}&friendId=${Friend.userid}`,{
          method:"GET",
          credentials:"include"
        })
        const data = await response.json()
        if (!response.ok)
          throw new Error (data.error)

        const newMessages = data.messages || []
        if (newMessages.length < 10) 
          setHasMore(false);

        const formatedData = newMessages.map((message) => ({
          id: message.id,
          senderId: message.sender_id,
          avatar: message.avatar,
          type: "text",
          text: message.content,
          timestamp: message.creationdate,
          isMe: user.id == message.senderId
        }))

        const newestFirst = formatedData.reverse();

        setMessages((prev) => {
          if (page === 1) 
            return newestFirst;
          return [...prev, ...newestFirst]; 
        })
        // console.log("newMessage==================",messages);
      }catch(err){
        console.log("Failed to fetch messages", err);
      }finally{
        setLoading(false)
      }
    }

    fetchMessages();
  },[page, Friend.userid])

  useEffect(() => {
    const handleReceive = (payload) => {
      setMessages((prev) => [{
        id: payload.msgId || Date.now(),
        senderId: payload.senderId,
        avatar: payload.avatar,
        text: payload.content,
        timestamp: payload.sentAt,
        isMe: false,
      }, ...prev]);
    };
    socket.on("chat:receiver", handleReceive)

    socket.on("chat:error", (err) => console.log(err.message));

    return () => {
      socket.off("chat:receiver");
      socket.off("chat:error");
    };
  },[socket])

  const handleSend = (content) => {
    const tmpMessage = {
      id: messages.length * 1000 + 1,
      senderId : user.id,
      type: "text",
      text: content,
      timestamp:new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    }

    setMessages((prev) => [tmpMessage, ...prev]);
    socket.emit('chat:send', {
      receiverId: selectedFriend.userid,
      content: content
    })
  }

  return (
    <div className="w-full flex flex-col flex-1 gap-2 rounded-lg h-full">
      <ChatHeader user={Friend} />
      <div className="flex-1 bg-[#333333]/65 rounded-lg flex flex-col overflow-hidden">
        <MessageList messages={messages} onLoadMore={() => setPage(p => p + 1)} loading={loading} hasMore={hasMore}/>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
