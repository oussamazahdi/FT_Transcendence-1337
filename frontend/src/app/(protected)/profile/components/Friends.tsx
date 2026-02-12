// Friends.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import FriendCard from "./FriendCard";
import { useAuth } from "@/contexts/authContext";
import { useSocket } from "@/contexts/socketContext";
import type { SocketType } from "@/contexts/socketContext";

interface FriendsProps {
  classname?: string;
}

type FriendSummary = {
  id: number;
  firstname: string;
  lastname: string;
  avatar?: string | null;
};

type FriendStatus = "Online" | "Offline";

// ✅ Must match your Socket types (UsersStatusPayload)
type UsersStatusPayload = Array<string | number> | Record<string, boolean>;

function normalizeOnlineIds(payload: UsersStatusPayload): number[] {
  // server sends: [1, 5, 9]
  if (Array.isArray(payload)) {
    return payload
      .map((x) => Number(String(x).trim()))
      .filter((n) => Number.isFinite(n) && Number.isInteger(n));
  }

  // server sends: { "1": true, "5": true, "9": true } (or mixed true/false)
  if (payload && typeof payload === "object") {
    return Object.entries(payload)
      .filter(([, isOnline]) => Boolean(isOnline))
      .map(([id]) => Number(String(id).trim()))
      .filter((n) => Number.isFinite(n) && Number.isInteger(n));
  }

  return [];
}

export default function Friends({ classname = "" }: FriendsProps) {
  const socket = useSocket() as SocketType | null;
  const { friends } = useAuth();

  const [onlineIds, setOnlineIds] = useState<number[]>([]);

  useEffect(() => {
    if (!socket) return;

    const onUsersStatus = (payload: UsersStatusPayload) => {
      setOnlineIds(normalizeOnlineIds(payload));
    };

    socket.on("users:status", onUsersStatus);

    return () => {
      socket.off("users:status", onUsersStatus);
    };
  }, [socket]);

  const onlineSet = useMemo(() => new Set(onlineIds), [onlineIds]);

  const friendList: FriendSummary[] = Array.isArray(friends) ? (friends as FriendSummary[]) : [];

  if (!socket) {
    return (
      <div className={`flex-1 bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}>
        <p className="font-bold text-sm shrink-0">Friends</p>
        <div className="text-sm text-center text-white/60 mt-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}>
      <p className="font-bold text-sm shrink-0">Friends</p>

      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {friendList.length === 0 ? (
          <div className="text-sm text-center text-white/60 mt-4">No friends</div>
        ) : (
          friendList.map((user) => {
            const status: FriendStatus = onlineSet.has(user.id) ? "Online" : "Offline";
            return <FriendCard key={user.id} user={{ ...user, status }} />;
          })
        )}
      </div>
    </div>
  );
}
