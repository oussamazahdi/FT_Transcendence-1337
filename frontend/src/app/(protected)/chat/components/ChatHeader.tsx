import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { ChevronLeftIcon, UserIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import BlockUserPopUp from "./BlockUserPopUp.tsx";
import { assets } from "@/assets/data";
import { useSelectedFriend } from "@/contexts/userContexts";
import type { SelectedFriend } from "@/contexts/userContexts";
import { useStatus } from "@/contexts/socketContext.tsx";

interface ChatHeaderProp { user:SelectedFriend }

const ChatHeader = ({ user }: ChatHeaderProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowconfirm] = useState(false);
  const { setSelectedFriend } = useSelectedFriend();

  const onlineSet = useStatus();
  const isOnline = onlineSet.has(String(user.id));
  const status = isOnline ? "Online" : "Offline";

  return (
    <div className="relative bg-[#0F0F0F]/65 flex items-center p-1 rounded-lg gap-1">
      <ChevronLeftIcon onClick={() => setSelectedFriend(null)} className="size-6 block md:hidden text-[#BABABA]"/>
      <div className="size-10 flex items-center overflow-hidden rounded-sm">
        <Image
          src={user.avatar || assets.defaultProfile}
          alt="avatar"
          width={40}
          height={40}
          className="object-cover"
          />
      </div>
      <div className="flex flex-col">
        <p className="font-bold">{user.firstname} {user.lastname}</p>
        <div className="flex items-center text-[9px] text-gray-500">
          <div
            className={`w-1.5 h-1.5 rounded-full mr-1 shrink-0 ${
              isOnline ? "bg-[#42A78A]" : "bg-[#B23B3B]"
            }`}
          />
          <p>{status}</p>
        </div>
      </div>
      <div className="ml-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer hover:scale-105 mt-2"
        >
          <EllipsisVertical className="size-6 text-[#BABABA]" />
        </button>
        {isOpen && (
          <div className="absolute z-10 right-0 top-full mt-2 rounded-lg w-48 bg-[#0F0F0F]/90 flex flex-col justify-center items-center gap-1 p-2 text-xs">
            <Link
              href={`/profile/${user.id}`}
              className="w-full py-2 flex justify-center items-center gap-2 bg-[#252525] hover:bg-[#8D8D8D]/25 rounded-sm cursor-pointer"
            >
              <UserIcon className="size-3" />
              <p>View profile</p>
            </Link>
            <button
              onClick={() => {
                setShowconfirm(true);
                setIsOpen(false);
              }}
              className="w-full py-2 flex justify-center items-center gap-2 bg-[#252525] hover:bg-[#8D8D8D]/25 rounded-sm cursor-pointer"
            >
              <XCircleIcon className="size-3 text-[#B03333]" />
              <p className="text-[#B03333]">Block Friend</p>
            </button>
          </div>
        )}
        {showConfirm && (
          <BlockUserPopUp user={user} setShowconfirm={setShowconfirm} />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
