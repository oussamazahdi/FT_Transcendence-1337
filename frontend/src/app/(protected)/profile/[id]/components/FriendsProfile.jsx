"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/data";
import Image from "next/image";
import Link from "next/link";
import {
  ChatBubbleOvalLeftIcon,
  ClockIcon,
  // NoSymbolIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Gamepad2 } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
// import RemoveUserConf from "./RemoveUserConf";

const FriendsProfile = ({ userPage }) => {
  const { sendFriendRequest, pendingRequests, cancelRequest, removeFriend, friends, user } = useAuth();
  const [isFriend, setIsFriend] = useState(false);
  const [ispending, setIsPending] = useState(false);
  const rawLevel = 15.65
  const progressPercent = Math.round((rawLevel % 1) * 100);

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

  }, [friends, pendingRequests, userPage]);



  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] flex flex-col pb-4 overflow-hidden p-3">
      <div className="relative w-full h-24 md:h-42 overflow-hidden">
        <Image
          src={assets.coverPicture}
          alt="cover"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col items-center -mt-12 md:-mt-16 z-5">
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
          <div className="flex gap-2 mt-1">
            {isFriend && (
              <button onClick={() => removeFriend(userPage)} className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
                < XMarkIcon  className="size-4 brightness-150" />
                  remove friend
              </button>
            )}
            {ispending && (
              <button onClick={() => cancelRequest(userPage)} className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
                <ClockIcon className="size-4 brightness-150" />
                  Cancel request
              </button>
            )}
            {!isFriend && !ispending && (
              <button onClick={() => sendFriendRequest(userPage)} className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
                <UserPlusIcon className="size-4 brightness-150" />
                  Add friend
              </button>
            )}
            <Link
              href={`/chat`}
              className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105"
            >
              <ChatBubbleOvalLeftIcon className="size-4 brightness-150" />
            </Link>
            <button className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105">
              <Gamepad2 strokeWidth={1.5} className="size-4 brightness-150" />
            </button>
          </div>
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs md:text-sm mb-1">
                <span className="font-bold ">Level: {rawLevel}</span>
                <span >1950/3000</span>
            </div>
            <div className="w-full bg-[#000000] rounded-full h-2.5">
                <div 
                    className="bg-[#D9D9D9] h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FriendsProfile;
