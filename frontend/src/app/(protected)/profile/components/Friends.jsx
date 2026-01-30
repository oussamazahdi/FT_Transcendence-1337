"use client";

import React, { useEffect, useMemo, useState } from "react";
import FriendCard from "./FriendCard";
import { useAuth } from "@/contexts/authContext";
import { useSocket } from "@/contexts/socketContext";

const Friends = ({ classname = "" }) => {
  const socket = useSocket();
  const { friends } = useAuth();

  // server sends: [1, 5, 9] (array of online user ids)
  const [onlineIds, setOnlineIds] = useState([]);

  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) socket.connect();

    const onUsersStatus = (data) => {
      // accept either array [ids] or object {id:true}
      if (Array.isArray(data)) setOnlineIds(data);
      else if (data && typeof data === "object") setOnlineIds(Object.keys(data).map(Number));
      else setOnlineIds([]);
    };

    socket.on("users:status", onUsersStatus);

    return () => {
      socket.off("users:status", onUsersStatus);
    };
  }, [socket]);

  const onlineSet = useMemo(() => new Set(onlineIds), [onlineIds]);

  const renderFriends = () => {
    if (!Array.isArray(friends) || friends.length === 0) {
      return <div className="text-sm text-center text-white/60 mt-4">No friends</div>;
    }

    return friends.map((user) => {
      const isOnline = onlineSet.has(user.id);
      return <FriendCard user={{ ...user, status: isOnline ? "Online" : "Offline" }} key={user.id} />;
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
