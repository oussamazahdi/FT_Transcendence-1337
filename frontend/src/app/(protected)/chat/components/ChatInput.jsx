import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Gamepad2Icon } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ChatInput = ({ onSend, friend }) => {
  const [inputValue, setInputValue] = useState("")
  const { blocked, friends } = useAuth()

  const router = useRouter();
  const isBlocked = blocked.some((user) => user.id == friend.id);
  const isFriend = friends.some((user) => user.id == friend.id);

  const handleSendMessage = () => {
    if (!inputValue.trim()) 
      return;
    onSend(inputValue)
    setInputValue("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") 
      handleSendMessage();
  };
  return (
    <div className="p-2">
    {isBlocked ? (
      <div className="md:py-3 text-center text-xs text-gray-500 h-10 bg-[#0F0F0F]/65 rounded-sm">
        You’ve put this friend on pause!{" "}
        <span className="font-semibold text-white hover:underline cursor-pointer">
          <Link href={"/settings?tab=blocked-users"}>Unblock</Link>
        </span>{" "}
        them anytime to chat again.
      </div>
    ) : !isFriend ? (
      <div className="md:py-3 text-center text-xs text-gray-500 h-10 bg-[#0F0F0F]/65 rounded-sm">
        You are not a friend of this user. Add him as a friend to chat with him.
      </div>
    ) : (
      <div className="flex w-full gap-1 items-center shrink-0">
        <div className="flex-1 h-10 bg-[#0F0F0F]/65 rounded-sm flex justify-start items-center px-2">
          <input
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="h-full w-full bg-transparent border-none outline-none text-xs text-white px-2 placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => handleSendMessage()}
          className="group bg-[#0F0F0F]/65 hover:bg-[#0F0F0F] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer transition"
        >
          <PaperAirplaneIcon className="size-4 text-[#FFFFFF]/50 group-hover:text-white" />
        </button>
        <button className="group bg-[#0F0F0F]/65 hover:bg-[#0F0F0F] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer transition">
          <Gamepad2Icon className="size-4 text-[#FFFFFF]/50 group-hover:text-white" />
        </button>
      </div>
    )}
  </div>
  );
};

export default ChatInput;
