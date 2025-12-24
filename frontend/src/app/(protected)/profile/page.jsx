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
    <div className="flex w-full mx-3 lg:w-4/5 h-[80vh] overflow-hidden gap-4">
      <div className="flex flex-col w-full basis-7/10 gap-4">
        <Profile user={user}/>
        <div className="flex justify-between h-[44vh] gap-4">
          <MatchPlayed/>
          <WinRate/>
        </div>
      </div>
      <div className="basis-3/10  flex flex-col gap-4">
        <Friends />
        <MatchHistory height="h-1/2"/>
      </div>
    </div>
  );
}
