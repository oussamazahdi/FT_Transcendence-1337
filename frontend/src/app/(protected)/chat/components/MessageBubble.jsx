import React from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";

const MessageBubble = (props) => {
  const { user } = useAuth();
  return (
    <div
      className={`flex gap-2 w-full mb-1 items-center ${props.isMe ? "flex-row-reverse" : "justify-start"}`}
    >
      {props.showAvatar ? (
        <Image
          src={`${props.isMe ? user.avatar : props.friendAvatar.src}`}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-sm flex-none self-start"
        />
      ) : (
        <div className="w-10 flex-none" />
      )}
      {props.message.type === "text" ? (
        <div
          className={`flex gap-3 max-w-[70%] p-2 rounded-xl text-xs ${
            props.isMe
              ? "bg-[#595959]/65 text-white"
              : "bg-[#0F0F0F]/65 text-white"
          }`}
        >
          <p className="break-all whitespace-pre-wrap">{props.message.text}</p>
          <span className="text-[10px] block opacity-50 text-right mt-1 whitespace-nowrap self-end">
            {props.message.timestamp}
          </span>
        </div>
      ) : props.message.gameType === "ping_pong" ? (
        <div
          className={`flex flex-col gap-3 max-w-[70%] p-2 rounded-xl text-xs ${
            props.isMe
              ? "bg-[#595959]/65 text-white"
              : "bg-[#0F0F0F]/65 text-white"
          }`}
        >
          <p className="font-medium">{"1 vs 1 ping pong game invitation"}</p>
          <div className="flex justify-center items-center gap-1">
            <button className="bg-[#583F3F]/55 text-[8px] text-[#D55C5C] px-3 py-1 rounded-xs hover:bg-[#8D4646]/50 cursor-pointer">
              Reject
            </button>
            <button className="bg-[#3F5846]/55 text-[8px] text-[#5CD57E] px-3 py-1 rounded-xs hover:bg-[#468C74]/50 cursor-pointer">
              Accept
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-3 max-w-[70%] p-2 rounded-xl text-xs ${
            props.isMe
              ? "bg-[#595959]/65 text-white"
              : "bg-[#0F0F0F]/65 text-white"
          }`}
        >
          <p className="font-medium">{"1 vs 1 Tic tac toe game invitation"}</p>
          <div className="flex justify-center items-center gap-1">
            <button className="bg-[#583F3F]/55 text-[8px] text-[#D55C5C] px-3 py-1 rounded-xs hover:bg-[#8D4646]/50 cursor-pointer">
              Reject
            </button>
            <button className="bg-[#3F5846]/55 text-[8px] text-[#5CD57E] px-3 py-1 rounded-xs hover:bg-[#468C74]/50 cursor-pointer">
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
