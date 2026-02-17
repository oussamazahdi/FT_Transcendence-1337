"use client";
import React, { useEffect } from "react";
import Friends from "../profile/components/Friends.tsx";
import Profile from "../profile/components/Profile.tsx";
import MatchHistory from "../profile/components/MatchHistory.tsx";
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
    <div className="grid w-[90vw] grid-cols-1 gap-2 md:h-[86vh] md:grid-cols-12 md:grid-rows-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1fr)]">
      <div className="min-w-0 md:col-span-4 md:col-start-1 md:row-start-1">
        <Profile user={user} aspect="aspect-4/2"/>
      </div>

      <div className="min-w-0 md:col-span-4 md:col-start-5 md:row-start-1">
        <CercleGraph />
      </div>

      <div className="min-w-0 md:col-span-8 md:col-start-1 md:row-start-2">
        <Games />
      </div>

      <div className="min-w-0 md:col-span-4 md:col-start-1 md:row-start-3">
        <WinRate id={user?.id}/>
      </div>

      <div className="min-w-0 md:col-span-4 md:col-start-5 md:row-start-3">
        <MatchesPlayed id={user?.id}/>
      </div>

      <div className="md:col-span-4 md:col-start-9 md:row-span-3  min-w-0">
        <div className="grid gap-2 grid-cols-1 md:grid-rows-2 md:h-full min-h-0">
            <Friends classname="min-h-0 md:overflow-auto" />
            <MatchHistory classname="min-h-0 md:overflow-auto" id={user?.id} />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
