import React, { useState } from 'react'
import { LinkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Gamepad2Icon } from "lucide-react";

const ChatInput = ( {messages, setMessages }) => {
  const [inputValue, setInputValue] = useState("");
  console.log(messages);
  const handleSendMessage = () => {
    if (!inputValue.trim())
        return;
    
    const newMsg = {
      id: messages.length + 1,
      type:"text",
      senderId: "1",
      text: inputValue,
      timestamp: new Date().toLocaleDateString([], {hour:'2-digit', minute:'2-digit'}),
      isMe: true,
    }

    setMessages([...messages, newMsg]);
    setInputValue("");
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter")
      handleSendMessage();
  }
  return (
    <div className="p-2 flex w-full gap-1 items-center shrink-0">
      <div className="flex-1 h-10 bg-[#0F0F0F]/65 rounded-sm flex justify-start items-center px-2">
        <button className="p-1 cursor-pointer hover:scale-110"><LinkIcon className="size-4 text-[#FFFFFF]/50 hover:text-white"/></button>
        <input 
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="h-full w-full bg-transparent border-none outline-none text-xs text-white px-2 placeholder-gray-500"/>
      </div>
      <button className="group bg-[#0F0F0F]/65 hover:bg-[#0F0F0F] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer transition"><PaperAirplaneIcon className="size-4 text-[#FFFFFF]/50 group-hover:text-white" /></button>
      <button className="group bg-[#0F0F0F]/65 hover:bg-[#0F0F0F] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer transition"><Gamepad2Icon className="size-4 text-[#FFFFFF]/50 group-hover:text-white" /></button>
    </div>
  )
}

export default ChatInput
