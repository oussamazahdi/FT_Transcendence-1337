"use client";
import React, { useEffect } from "react";
import Friends from "../profile/components/Friends.tsx";
import Profile from "../profile/components/Profile.tsx";
import MatchHistory from "../profile/components/MatchHistory";
import { useAuth } from "@/contexts/authContext.tsx";
import WinRate from "../profile/components/WinRate.tsx";
import Games from "./components/Games.tsx";
import CercleGraph from "./components/CercleGraph.tsx";
import MatchesPlayed from "../profile/components/MatchPlayed.tsx";

const Dashboard = () => {
  const { user, refreshFriendReq } = useAuth();
  
  useEffect(() => {
    refreshFriendReq();
  }, [refreshFriendReq]);
  return (
    <div className="grid w-full max-w-7xl grid-cols-1 gap-2 md:h-[86vh] md:grid-cols-12 md:grid-rows-[minmax(0,1fr)_minmax(0,0.5fr)_minmax(0,1fr)]">
      <div className="min-w-0 md:col-span-4 md:col-start-1 md:row-start-1">
        <Profile user={user} className="w-full h-full" aspect="aspect-4/2"/>
      </div>

      <div className="min-w-0 md:col-span-4 md:col-start-5 md:row-start-1">
        <CercleGraph />
      </div>

      <div className="min-w-0 md:col-span-8 md:col-start-1 md:row-start-2">
        <Games />
      </div>

      <div className="min-w-0 md:col-span-4 md:col-start-1 md:row-start-3">
        <WinRate />
      </div>

      <div className="min-w-0 md:col-span-4 md:col-start-5 md:row-start-3">
        <MatchesPlayed />
      </div>

      <div className="grid min-w-0 h-full grid-rows-2 gap-2 md:col-span-4 md:col-start-9 md:row-start-1 md:row-span-3">
        <Friends classname="h-full min-h-0" />
        <MatchHistory classname="h-full min-h-0" />
      </div>
    </div>
  );
};

export default Dashboard;
