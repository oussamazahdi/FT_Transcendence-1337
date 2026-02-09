"use client";
import React, { useEffect } from "react";
import Friends from "../profile/components/Friends.tsx";
import Profile from "../profile/components/Profile.tsx";
import MatchHistory from "../profile/components/MatchHistory";
import { useAuth } from "@/contexts/authContext.tsx";
import WinRate from "../profile/components/WinRate.tsx";
import Games from "./components/Games.tsx";
import CercleGraph from "./components/CercleGraph.tsx";

const Dashboard = () => {
  const { user, refreshFriendReq } = useAuth();
  
  useEffect(()=>{
      refreshFriendReq();
  },[refreshFriendReq])
  return (
    <div className="flex w-full max-w-7xl flex-col md:flex-row gap-4 h-auto md:h-[86vh]">
      <div className="flex flex-col w-full md:w-7/10 gap-4">
        <div className="flex flex-col md:flex-row gap-4 h-auto md:flex-1">
          <Profile user={user} className="w-full md:w-6/10"/>
          <CercleGraph/>
        </div>
        <div className="flex flex-col md:flex-row gap-4 h-auto md:flex-1">
          <WinRate />
          <Games />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-3/10">
        <Friends classname="w-full h-100 md:flex-1" />
        <MatchHistory classname="w-full h-100 md:flex-1" />
      </div>
      
    </div>
  );
};

export default Dashboard;