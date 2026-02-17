// FriendCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import { Gamepad2 } from "lucide-react";
import { assets } from "@/assets/data";
import { useSocket, GameInvitePayload, InviteResponse } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";

type FriendStatus = "Online" | "Offline";

type FriendCardUser = {
  id: string | number;
  firstname: string;
  lastname: string;
  avatar?: string | null;
  status?: FriendStatus | "online" | "offline";
};

interface FriendCardProps {
  user: FriendCardUser;
}

export function safeUUID(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeStatus(raw: FriendCardUser["status"]): FriendStatus {
  const s = String(raw ?? "").trim().toLowerCase();
  return s === "online" ? "Online" : "Offline";
}

const FriendCard = ({ user }: FriendCardProps) => {
  const socket = useSocket();
  const { triggerError } = useAuth();

  const status = normalizeStatus(user.status);

  const sendInvite = (): void => {
    if (!socket) return;

    const payload: GameInvitePayload = {
      user: user.id,
      roomId: safeUUID(),
      gameType: "pingpong",
    };

    socket.emit("game:invite", payload, (res: InviteResponse): void => {
      if (!res.ok) 
        triggerError("An unexpected error occurred. Please try again.")
    });
  };

  return (
    <div className="flex items-center w-full bg-[#414141]/60 rounded-lg p-1 gap-1">
      <div className="relative w-10 h-10 overflow-hidden rounded-sm shrink-0">
        <Image
          src={user?.avatar ?? assets.defaultProfile}
          alt="icon"
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-xs font-bold truncate w-full">
          {user.firstname} {user.lastname}
        </p>

        <div className="flex items-center text-[9px] text-gray-500">
          <div
            className={`w-1.5 h-1.5 rounded-full mr-1 shrink-0 ${
              status === "Online" ? "bg-[#42A78A]" : "bg-[#B23B3B]"
            }`}
          />
          <p>{status}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          className="w-12 h-7 bg-[#151515]/70 flex justify-center items-center rounded-lg cursor-pointer hover:brightness-150 hover:scale-110"
          onClick={sendInvite}
          type="button"
        >
          <Gamepad2 className="size-4" />
        </button>

        <Link
          href={`/profile/${user.id}`}
          className="w-12 h-7 bg-[#151515]/70 flex justify-center items-center rounded-lg cursor-pointer hover:brightness-150 hover:scale-110"
        >
          <UserIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
