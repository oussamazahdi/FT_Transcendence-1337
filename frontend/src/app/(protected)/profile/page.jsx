"use client"
import React from "react";
import Friends from "./components/Friends";
import MatchPlayed from "./components/MatchPlayed";
import Profile from "./components/Profile";
import WinRate from "./components/WinRate";
import { useAuth } from "@/contexts/authContext";
import MatchHistory from "./components/MatchHistory";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="flex w-full max-w-7xl mx-3 flex-col md:flex-row gap-4 h-[86vh]">
      <div className="flex flex-1 flex-col w-full basis-7/10 gap-4">
        <Profile user={user}/>
        <div className="flex flex-1 flex-col md:flex-row justify-between gap-4">
          <MatchPlayed/>
          <WinRate/>
        </div>
      </div>
      <div className="basis-3/10  flex flex-col gap-4 h-full">
        <Friends classname="h-1/2"/>
        <MatchHistory/>
      </div>
    </div>
  );
}
