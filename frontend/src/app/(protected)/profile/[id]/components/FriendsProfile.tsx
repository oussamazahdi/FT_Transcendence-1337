"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
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

import { assets } from "@/assets/data";
import { useAuth } from "@/contexts/authContext";
import RemoveUserConf from "./RemoveUserConf";
import BlockUserPopUp from "@/app/(protected)/chat/components/BlockUserPopUp";
import type { otherUserData } from "@/types/index";
import { useSocket, type GameInvitePayload, type InviteResponse } from "@/contexts/socketContext";

interface FriendProfileProp {
  userPage: otherUserData;
}

function safeUUID(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function FriendsProfile({ userPage }: FriendProfileProp) {
  const socket = useSocket(); // ✅ hook at top level

  const {
    sendFriendRequest,
    pendingRequests,
    cancelRequest,
    incomingRequest,
    acceptRequest,
    friends,
  } = useAuth();

  const [showConfirmRemove, setShowconfirmRemove] = useState(false);
  const [showConfirmBlock, setShowconfirmBlock] = useState(false);

  const rawLevel = 15.65;
  const progressPercent = useMemo(() => Math.round((rawLevel % 1) * 100), [rawLevel]);

  const isFriend = useMemo(() => friends.some((item) => item.id === userPage.id), [friends, userPage.id]);
  const isPending = useMemo(
    () => pendingRequests.some((item) => item.id === userPage.id),
    [pendingRequests, userPage.id]
  );
  const isIncoming = useMemo(
    () => incomingRequest.some((item) => item.id === userPage.id),
    [incomingRequest, userPage.id]
  );

  const sendInvite = useCallback(() => {
    if (!socket) return;

    const payload: GameInvitePayload = {
      user: userPage.id,
      roomId: safeUUID(),
      gameType: "pingpong",
    };

    socket.emit("game:invite", payload, (res: InviteResponse) => {
      if (!res.ok) console.error("Invite failed:", res.message);
      // optionally show toast here
    });
  }, [socket, userPage.id]);

  // optional: close popups if user changes
  useEffect(() => {
    setShowconfirmRemove(false);
    setShowconfirmBlock(false);
  }, [userPage.id]);

  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] flex flex-col pb-4 overflow-hidden p-3">
      <div className="relative w-full h-24 md:h-42 overflow-hidden">
        <Image src={assets.coverPicture} alt="cover" fill className="object-cover rounded-lg" />
      </div>

      <div className="flex flex-col items-center -mt-12 md:-mt-16 z-5">
        <div className="relative rounded-[10px]">
          {userPage?.avatar && userPage.avatar !== "null" ? (
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
          <span className="text-[#727272] font-thin text-xs md:text-sm inline">[@{userPage.username}]</span>
        </p>

        <div className="flex gap-2 mt-1">
          {isFriend && (
            <button
              onClick={() => setShowconfirmRemove(true)}
              className="flex items-center gap-1 bg-red-500/60 hover:bg-red-700/60 text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105"
            >
              <XMarkIcon className="size-4 brightness-150" />
              Remove friend
            </button>
          )}

          {isPending && (
            <button
              onClick={() => cancelRequest(userPage)}
              className="flex items-center gap-1 bg-red-500/60 hover:bg-red-700/60 text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105"
            >
              <ClockIcon className="size-4 brightness-150" />
              Cancel request
            </button>
          )}

          {isIncoming && (
            <button
              onClick={() => acceptRequest(userPage)}
              className="flex items-center gap-1 bg-green-500/60 hover:bg-green-700/60 text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105"
            >
              <CheckIcon className="size-4 brightness-150" />
              Accept request
            </button>
          )}

          {!isFriend && !isPending && !isIncoming && (
            <button
              onClick={() => sendFriendRequest(userPage)}
              className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105"
            >
              <UserPlusIcon className="size-4 brightness-150" />
              Add friend
            </button>
          )}

          {isFriend && (
            <Link
              href={`/chat?id=${userPage.id}`}
              className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105"
            >
              <ChatBubbleOvalLeftIcon className="size-4 brightness-150" />
            </Link>
          )}

					<button
						onClick={sendInvite}
						type="button"
						className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105"
						title={!socket ? "Socket not ready" : "Invite to game"}
						disabled={!socket}
					>
						<Gamepad2 strokeWidth={1.5} className="size-4 brightness-150" />
					</button>

          <button
            onClick={() => setShowconfirmBlock(true)}
            className="flex justify-center items-center p-2 bg-[#583636]/40 hover:bg-[#583636] rounded-sm transition-colors cursor-pointer hover:scale-105"
          >
            <NoSymbolIcon strokeWidth={1.5} className="size-4 brightness-150 text-[#D92F2F]" />
          </button>
        </div>

        <div className="w-full mt-4">
          <div className="flex justify-between text-xs md:text-sm mb-1">
            <span className="font-bold">Level: {rawLevel}</span>
            <span>1950/3000</span>
          </div>
          <div className="w-full bg-[#000000] rounded-full h-2.5">
            <div
              className="bg-[#D9D9D9] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {showConfirmRemove && <RemoveUserConf user={userPage} setShowconfirmRemove={setShowconfirmRemove} />}
      {showConfirmBlock && <BlockUserPopUp user={userPage} setShowconfirm={setShowconfirmBlock} />}
    </div>
  );
}
