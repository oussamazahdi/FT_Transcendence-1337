import React from "react";
import Image, { StaticImageData } from "next/image";
import { useAuth } from "@/contexts/authContext.tsx";
import { assets } from "@/assets/data";
import type { ChatMessage } from "@/types";
import { parseTime } from "@/lib/utils"

interface MessageBubble{
  message: ChatMessage
  isMe: boolean
  showAvatar: boolean
  friendAvatar : StaticImageData | string | null
	handleGameInvite: (status:string, id: string | number) => void
}

const MessageBubble = (props:MessageBubble) => {
  const { user } = useAuth();
  const time = parseTime(props.message.timestamp)
  const isMe = props.message.isMe;
  const now = new Date();
  const messageTime = new Date(props.message.timestamp);
  const expirationTime = new Date(messageTime.getTime() + (15 * 60 * 1000));
  const isExpired = now > expirationTime;
  let status = props.message.status;

  return (
    <div className={`flex gap-1 w-full items-center ${props.isMe ? "flex-row-reverse" : "justify-start"}`}>
      <div className="size-9 overflow-hidden rounded-sm">
        {props.showAvatar ? (
          <Image
          src={`${props.isMe ? (user?.avatar || assets.defaultProfile.src) :( props.friendAvatar || assets.defaultProfile.src)}`}
          alt="avatar"
          width={40}
          height={40}
          className="object-cover"
          />
        ) : (
          <div className="w-10 flex-none" />
        )}
      </div>
      {props.message.type == "text_message" ? (
        <div
          className={`flex gap-3 max-w-[70%] p-2 rounded-xl text-xs ${
            props.isMe
              ? "bg-[#595959]/65 text-white"
              : "bg-[#0F0F0F]/65 text-white"
          }`}
        >
          <p className="break-all whitespace-pre-wrap">{props.message.text}</p>
          <span className="text-[10px] block opacity-50 text-right mt-1 whitespace-nowrap self-end">
            {time}
          </span>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-2 max-w-[70%] p-2 rounded-xl text-xs ${
            props.isMe
              ? "bg-[#595959]/65 text-white"
              : "bg-[#0F0F0F]/65 text-white"
          }`}
        >
          <p className="font-medium">{"1 vs 1 ping pong game invitation"}</p>
          {!isMe && (
            status === "accepted" ? <p className="text-center text-[10px] text-gray-500">game invite <span className="text-[#5CD57E]/70">accepted</span></p> : 
            (status === "rejected" ? <p className="text-center text-[10px] text-gray-500">game invite <span className="text-[#D55C5C]/70">rejected</span></p> : 
            ( isExpired ? <p className="text-center text-[10px] text-gray-500">game invite <span className="text-gray-400">expired</span></p> :
              <div className="flex justify-center items-center gap-1">
              <button onClick={() => props.handleGameInvite("reject", props.message.id)} className="bg-[#583F3F]/55 text-[8px] text-[#D55C5C] px-3 py-1 rounded-xs hover:bg-[#8D4646]/50 cursor-pointer">
                Reject
              </button>
              <button onClick={() => props.handleGameInvite("accept", props.message.id)} className="bg-[#3F5846]/55 text-[8px] text-[#5CD57E] px-3 py-1 rounded-xs hover:bg-[#468C74]/50 cursor-pointer">
                Accept
              </button>
            </div>)))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
