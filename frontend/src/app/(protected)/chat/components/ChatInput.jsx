import React, { useEffect, useRef, useState } from "react";
import { LinkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Gamepad2Icon } from "lucide-react";

const ChatInput = ({ messages, setMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pingPongInvite = () => {
    const newMessage = {
      id: messages.length + 1,
      senderId: "3007",
      type: "game_invite",
      gameType: "ping_pong",
      timestamp: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    setMessages([...messages, newMessage]);
  };

  const ticTacToeInvite = () => {
    const newMessage = {
      id: messages.length + 1,
      senderId: "3007",
      type: "game_invite",
      gameType: "tic_tac_toe",
      timestamp: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      type: "text",
      senderId: "3007",
      text: inputValue,
      timestamp: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") 
      handleSendMessage();
  };
  return (
    <div className="relative p-2 flex w-full gap-1 items-center shrink-0">
      <div className="flex-1 h-10 bg-[#0F0F0F]/65 rounded-sm flex justify-start items-center px-2">
        <button className="p-1 cursor-pointer hover:scale-110">
          <LinkIcon className="size-4 text-[#FFFFFF]/50 hover:text-white" />
        </button>
        <input
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="h-full w-full bg-transparent border-none outline-none text-xs text-white px-2 placeholder-gray-500"
        />
      </div>
      <button onClick={() => handleSendMessage()} className="group bg-[#0F0F0F]/65 hover:bg-[#0F0F0F] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer transition">
        <PaperAirplaneIcon className="size-4 text-[#FFFFFF]/50 group-hover:text-white" />
      </button>
      <div ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group bg-[#0F0F0F]/65 hover:bg-[#0F0F0F] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer transition"
        >
          <Gamepad2Icon className="size-4 text-[#FFFFFF]/50 group-hover:text-white" />
        </button>
        {isOpen && (
          <div className="absolute z-10 right-2 bottom-full mt-2 rounded-lg w-48 bg-[#0F0F0F]/90 flex flex-col justify-center items-center gap-1 p-2 text-[9px] font-semibold">
            <button
              onClick={() => {
                pingPongInvite();
                setIsOpen(false);
              }}
              className="w-full py-2 flex justify-center items-center gap-2 bg-[#252525] hover:bg-[#8D8D8D]/25 rounded-sm cursor-pointer"
            >
              1 vs 1 Ping pong Game
            </button>
            <button
              onClick={() => {
                ticTacToeInvite();
                setIsOpen(false);
              }}
              className="w-full py-2 flex justify-center items-center gap-2 bg-[#252525] hover:bg-[#8D8D8D]/25 rounded-sm cursor-pointer"
            >
              1 vs 1 Tic Tac Toe Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
