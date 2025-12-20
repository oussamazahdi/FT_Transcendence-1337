"use client"
import React from "react";
import Friends from "./components/friends";
import MatchPlayed from "./components/matchPlayed";
import Profile from "./components/profile";
import WinRate from "./components/winRate";
import { useAuth } from "@/contexts/authContext";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="flex w-full mx-3 lg:w-4/5 h-[80vh] overflow-hidden gap-4">
      <div className="flex flex-col w-full basis-5/7 gap-4">
        <Profile user={user}/>
        <div className="flex justify-between h-[44vh] gap-4">
          <MatchPlayed/>
          <WinRate/>
        </div>
      </div>
      <Friends/>
    </div>
  );
}
