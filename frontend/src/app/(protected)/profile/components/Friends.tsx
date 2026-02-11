"use client";

import React, { useEffect, useMemo, useState } from "react";
import FriendCard from "./FriendCard";
import { useAuth } from "@/contexts/authContext";
import { useSocket } from "@/contexts/socketContext";
interface FriendsProps {
  classname?: string;
}

type FriendSummary = {
  id: string | number;
  firstname: string;
  lastname: string;
  avatar?: string | null;
};

type FriendStatus = "Online" | "Offline";
type OnlineStatusPayload = Array<string | number> | Record<string, boolean> | null | undefined;

const Friends = ({ classname = "" }: FriendsProps) => {
  const socket = useSocket();
  const { friends } = useAuth();

  // server sends: [1, 5, 9] (array of online user ids)
  const [onlineIds, setOnlineIds] = useState<string[]>([]);

  useEffect(() => {
		console.log("**********************************************************1");
    if (!socket) return;
		console.log("**********************************************************2");

		if (!socket.connected) socket.connect();

		const onUsersStatus = (data: OnlineStatusPayload) => {
			console.log("++++++++++> data:", data);
			if (Array.isArray(data)) {
				const ids = data.filter((id) => typeof id === "string" || typeof id === "number").map((id) => String(id));
				setOnlineIds(ids);
				console.log("+++++++++++> ids:", ids);
			} else if (data && typeof data === "object") {
				setOnlineIds(Object.keys(data));
			} else {
				setOnlineIds([]);
			}
			console.log("///////////////////////////////// online:", onlineIds);
		};

		socket.on("users:status", onUsersStatus);

    return () => {
      socket.off("users:status", onUsersStatus);
    };
  }, [socket]);

  const onlineSet = useMemo(() => new Set(onlineIds), [onlineIds]);

  const renderFriends = () => {
    const friendList = Array.isArray(friends) ? (friends as FriendSummary[]) : [];
    if (friendList.length === 0) {
      return <div className="text-sm text-center text-white/60 mt-4">No friends</div>;
    }

    return friendList.map((user) => {
      const isOnline = onlineSet.has(String(user.id));
      const status: FriendStatus = isOnline ? "Online" : "Offline";
      return <FriendCard user={{ ...user, status }} key={user.id} />;
    });
  };

  return (
    <div className={`flex-1 bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}>
      <p className="font-bold text-sm shrink-0">Friends</p>

      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {renderFriends()}
      </div>
    </div>
  );
};

export default Friends;
