"use client";
import React from "react";
import Friends from "../profile/components/Friends";
import Profile from "../profile/components/Profile";
import MatchHistory from "../profile/components/MatchHistory";
import { useAuth } from "@/contexts/authContext";
import WinRate from "../profile/components/WinRate";
import Games from "./components/Games";

const dashboard = () => {
  const { user } = useAuth();
	const vara = process.env.NEXT_PUBLIC_ENCRYPTION_OBJECT;


	console.log(' ===? ' , vara)
  return (
    <div className="flex w-full max-w-7xl flex-col md:flex-row gap-4 h-auto md:h-[86vh]">
      <div className="flex flex-col w-full md:w-7/10 gap-4">
        <div className="flex flex-col md:flex-row gap-4 h-auto md:flex-1">
          <Profile user={user} className="w-full md:w-6/10"/>
          <MatchHistory classname="w-full md:w-4/10 max-h-[360px] md:max-h-150" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 h-auto md:flex-1">
          <WinRate className="w-full md:w-1/2" />
          <Games className="w-full md:w-1/2" />
        </div>
      </div>
      <div className="w-full md:w-3/10">
        <Friends classname="w-full h-[400px] md:h-full" />
      </div>
      
    </div>
  );
};

export default dashboard;