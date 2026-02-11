"use client";
import { useEffect } from "react";
import Friends from "./components/Friends.tsx";
import MatchPlayed from "./components/MatchPlayed.tsx";
import Profile from "./components/Profile.tsx";
import WinRate from "./components/WinRate.tsx";
import { useAuth } from "@/contexts/authContext";
import MatchHistory from "./components/MatchHistory";

export default function ProfilePage() {
  const { user, refreshFriendReq } = useAuth();
  
  useEffect(()=>{
      refreshFriendReq();
  },[refreshFriendReq])
  
  return (
    <div className="grid w-full max-w-7xl grid-cols-1 gap-4 md:h-[86vh] md:grid-cols-12 md:grid-rows-[repeat(2,minmax(0,1fr))]">
      <div className="min-w-0 md:col-span-8 md:row-start-1">
        <Profile user={user} className="h-full" aspect="aspect-4/1" />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:col-span-8 md:row-start-2 md:grid-cols-2">
        <MatchPlayed />
        <WinRate />
      </div>

      <div className="grid min-w-0 h-full grid-rows-2 gap-4 md:col-span-4 md:col-start-9 md:row-span-2">
        <Friends classname="h-full min-h-0" />
        <MatchHistory classname="h-full min-h-0" />
      </div>
    </div>
  );
}
