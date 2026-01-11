"use client";

import React, { use } from "react";
import { useSocket } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";
import { api } from "@/lib/api";
import { useEffect } from "react";

const  Dashboard = () => {
  const socket = useSocket();
  const { user } = useAuth();

  const sendInvite = () => {
    if (!socket) {
      console.log("❌ socket not connected");
      return;
    }

    // TEST LOGIC: only 2 users (1 and 2)
    const toUserId = user.id === 1 ? 2 : 1;

    socket.emit(
      "game:invite",
      {
        toUserId,
        roomId: "test-room-1",
        gameType: "pingpong",
      },
      (res) => {
        if (!res.ok) {
          console.error("Invite failed:", res.message);
        } else {
          console.log("✅ Invite sent:", res.notification);
        }
      }
    );
  };


  return (
    <div className="flex flex-col">
      <h1 className="mb-10">This is dashboard</h1>

      <button
        onClick={sendInvite}
        className="bg-red-600/30 px-5 py-2 rounded-md transition-all duration-150 hover:bg-red-700/30"
      >
        Game Invitation
      </button>
    </div>
  );
};

export default Dashboard;
