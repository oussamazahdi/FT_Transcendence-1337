"use client";
import { useEffect } from "react";
import Friends from "./components/Friends.tsx";
import MatchPlayed from "./components/MatchPlayed.tsx";
import Profile from "./components/Profile.tsx";
import WinRate from "./components/WinRate.tsx";
import { useAuth } from "@/contexts/authContext";
import MatchHistory from "./components/MatchHistory.tsx";

export default function ProfilePage() {
  const { user, refreshFriendReq } = useAuth();
  
  useEffect(()=>{
      refreshFriendReq();
  },[refreshFriendReq])
  return (
    <div className="grid w-[90vw] mx-3 grid-cols-1 gap-2 md:h-[86vh] md:grid-cols-12 md:grid-rows-2">
      <div className="min-w-0 md:col-span-8 md:row-start-1">
        <Profile user={user} aspect="aspect-4/1" />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-2 md:col-span-8 md:row-start-2 md:grid-cols-2">
        <MatchPlayed id={user?.id}/>
        <WinRate id={user?.id}/>
      </div>

      <div className="md:col-span-4 md:col-start-9 md:row-span-2  min-w-0">
        <div className="grid gap-2 grid-cols-1 md:grid-rows-2 md:h-full min-h-0">
          <Friends classname="min-h-0 md:overflow-auto" />
          <MatchHistory classname="min-h-0 md:overflow-auto" id={user?.id} />
        </div>
      </div>
    </div>
  );
}
