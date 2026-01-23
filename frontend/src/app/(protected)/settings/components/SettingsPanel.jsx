import React, { useContext } from "react";
import Personal_information from "./personal-information";
import BlockedUsers from "./blocked-users";
import Security from "./security";
import GameSettings from "./Game-setiings";
import { ActiveTabContext } from "@/contexts/userContexts";
import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function SettingsPanel() {
  const {ActiveTab, setActiveTab} = useContext(ActiveTabContext);
  return (
    <div className="h-full min-h-[90vh] flex-1 bg-[#0F0F0F]/75 rounded-[12px] py-2 overflow-y-auto">
      <ArrowLeftIcon onClick={() => setActiveTab(null)} className="size-6 m-4 block md:hidden text-[#BABABA]"/>
      {ActiveTab === "personal-information" && <Personal_information />}
      {ActiveTab === "blocked-users" && <BlockedUsers />}
      {ActiveTab === "security" && <Security />}
      {ActiveTab === "Game-setiings" && <GameSettings />}
    </div>
  );
}
