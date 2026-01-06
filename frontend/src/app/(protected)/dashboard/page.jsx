"use client"
import React from "react";
import Friends from "../profile/components/Friends";
import Profile from "../profile/components/Profile";
import MatchHistory from "../profile/components/MatchHistory";
import { useAuth } from "@/contexts/authContext";
import WinRate from "../profile/components/WinRate";
import Games from "./components/Games";

const dashboard = () => {
  const {user} = useAuth();
  return (
    <div className="flex w-full max-w-7xl mx-3 flex-col md:flex-row gap-4 h-[86vh]">
      <div className="flex flex-col basis-2/3 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Profile user={user} />
          <MatchHistory classname="md:max-h-[310px]"/>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <WinRate />
          <Games />
        </div>
      </div>
      <div className="flex-1">
        <Friends classname="md:max-h-[86vh]"/>
      </div>

    </div>
  );
};

export default dashboard;
