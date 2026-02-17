"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/data";
import Image from "next/image";
import Link from "next/link";
import {
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  ClockIcon,
  NoSymbolIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Gamepad2 } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import RemoveUserConf from "./RemoveUserConf.tsx";
import BlockUserPopUp from "@/app/(protected)/chat/components/BlockUserPopUp";
import {otherUserData} from "@/types/index.ts"

interface FriendProfileProp{
  userPage:otherUserData
}

const FriendsProfile = ({ userPage }:FriendProfileProp) => {
  const { sendFriendRequest, pendingRequests, cancelRequest, incomingRequest, acceptRequest, friends } = useAuth();
  const [isFriend, setIsFriend] = useState(false);
  const [ispending, setIsPending] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [showConfirmRemove, setShowconfirmRemove] = useState(false);
  const [showConfirmBlock, setShowconfirmBlock] = useState(false);
  const rawLevel = userPage?.player_level || 0;
  const progressPercent = Math.round((rawLevel % 1) * 100);
  const xp = userPage?.player_xp || 0
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPage) 
      return;

    const isFriendFound = friends.some(item => item.id === userPage.id);
    if (isFriendFound) {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }

    const isPendingFound = pendingRequests.some(item => item.id === userPage.id);
    if (isPendingFound) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }

    const isIncomingFound = incomingRequest.some(items => items.id === userPage.id);
    if (isIncomingFound) {
      setIsIncoming(true);
    } else {
      setIsIncoming(false);
    }
    setLoading(false);
  }, [friends, pendingRequests, incomingRequest, userPage]);

  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] flex flex-col overflow-hidden p-3 h-full min-h-0">
      <div className="relative w-full aspect-4/2 overflow-hidden rounded-lg">
        <Image
          src={assets.coverPicture}
          alt="cover"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-1 flex-col items-center -mt-12 md:-mt-16 z-5">
        <div className="relative rounded-[10px]">
          {userPage?.avatar && userPage?.avatar !== "null" ? (
            <Image
              src={userPage.avatar}
              alt="profile picture"
              width={80}
              height={80}
              className="rounded-[10px] w-20 h-20 md:w-24 md:h-24 object-cover"
            />
          ) : (
            <Image
              src={assets.defaultProfile}
              alt="avatar"
              height={80}
              width={80}
              className="rounded-[10px] w-20 h-20 md:w-24 md:h-24 object-cover"
            />
          )}
        </div>
        <p className="text-white font-bold mt-2 text-sm md:text-lg">
          {userPage.firstname} {userPage.lastname}{" "}
          <span className="text-[#727272] font-thin text-xs md:text-sm inline">
            [@{userPage.username}]
          </span>
        </p>
        {loading ? <p>loading...</p> : (
        <div className="flex gap-2 mt-1">
          {isFriend && (
            <button onClick={() => setShowconfirmRemove(!showConfirmRemove)} className="flex items-center gap-1 bg-red-500/60 hover:bg-red-700/60 text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
              <XMarkIcon  className="size-4 brightness-150" />
                Remove friend
            </button>
          )}
          {ispending && (
            <button onClick={() => cancelRequest(userPage)} className="flex items-center gap-1 bg-red-500/60 hover:bg-red-700/60 text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
              <ClockIcon className="size-4 brightness-150" />
                Cancel request
            </button>
          )}
          {isIncoming && (
            <button onClick={() => acceptRequest(userPage)} className="flex items-center gap-1 bg-green-500/60 hover:bg-green-700/60 text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
              <CheckIcon className="size-4 brightness-150" />
                Accept request
            </button>
          )}
          {!isFriend && !ispending && !isIncoming && (
            <button onClick={() => sendFriendRequest(userPage)} className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
              <UserPlusIcon className="size-4 brightness-150" />
                Add friend
            </button>
          )}
          {isFriend && 
            <Link
              href={`/chat?id=${userPage.id}`}
              className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105"
            >
              <ChatBubbleOvalLeftIcon className="size-4 brightness-150" />
            </Link>}
          <button onClick={() => setShowconfirmBlock(true)} className="flex justify-center items-center p-2 bg-[#583636]/40 hover:bg-[#583636] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <NoSymbolIcon strokeWidth={1.5} className="size-4 brightness-150 text-[#D92F2F]" />
          </button>
        </div>
          )}
        <div className="w-full mt-auto px-1 pt-2">
          <div className="flex justify-between text-xs md:text-sm mb-1">
              <span className="font-bold ">Level: {rawLevel.toFixed(2)}</span>
              <span >{xp}/{(Math.floor(rawLevel) + 1) * 3000}</span>
          </div>
          <div className="w-full bg-[#000000] rounded-full h-2.5">
              <div 
                  className="bg-linear-to-r from-blue-200 via-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
              ></div>
          </div>
        </div>
        </div>
        {showConfirmRemove && (
          <RemoveUserConf user={userPage} setShowconfirmRemove={setShowconfirmRemove}/>
        )}
        {showConfirmBlock && (
          <BlockUserPopUp user={userPage} setShowconfirm={setShowconfirmBlock}/>
        )}
      </div>
  );
};

export default FriendsProfile;