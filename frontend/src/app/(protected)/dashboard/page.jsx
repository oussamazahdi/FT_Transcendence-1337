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
  return (
    <div className="flex w-full max-w-7xl flex-col md:flex-row gap-4 h-[86vh]">
      <div className="flex flex-col md:w-7/10 gap-4">
        <div className="flex h-1/2 flex-col md:flex-row gap-4">
          <Profile user={user} className="md:w-6/10"/>
          <MatchHistory classname="max-h-[360px] md:w-4/10" />
        </div>
        <div className="flex h-1/2 flex-col md:flex-row gap-4">
          <WinRate />
          <Games />
        </div>
      </div>
      <div className="md:w-3/10">
        <Friends classname="md:h-1/1 max-h-[360px] md:max-h-[86vh]" />
      </div>
    </div>
  );
};

export default dashboard;
