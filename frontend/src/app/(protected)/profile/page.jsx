"use client";
import React, { useEffect } from "react";
import Friends from "./components/Friends";
import MatchPlayed from "./components/MatchPlayed";
import Profile from "./components/Profile";
import WinRate from "./components/WinRate";
import { useAuth } from "@/contexts/authContext";
import MatchHistory from "./components/MatchHistory";

export default function ProfilePage() {
  const { user, refreshFriendReq } = useAuth();
  
  useEffect(()=>{
      refreshFriendReq();
  },[])
  return (
    <div className="flex w-full max-w-7xl flex-col md:flex-row gap-4 h-auto md:h-[86vh] overflow-y-auto">
      <div className="flex flex-col w-full md:flex-1 md:basis-7/10 gap-4">
        <Profile user={user} />
        <div className="flex flex-col md:flex-row flex-1 justify-between gap-4 w-full">
          <MatchPlayed className="w-full md:flex-1" />
          <WinRate className="w-full md:flex-1" />
        </div>
      </div>
      <div className="w-full md:basis-3/10 flex flex-col gap-4 h-auto md:h-full">
        <Friends classname="w-full h-100 md:h-auto md:flex-1" />
        <MatchHistory classname="w-full h-100 md:h-auto md:flex-1" />
      </div>

    </div>
  );
}