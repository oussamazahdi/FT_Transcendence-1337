import React from "react";
import Personal_information from "./personal-information.tsx";
import BlockedUsers from "./blocked-users.tsx";
import Security from "./security.tsx";
import GameSettings from "./Game-settings";
import { useActiveTab } from "@/contexts/userContexts.ts";
import { ArrowLeftIcon} from "@heroicons/react/24/outline";

export default function SettingsPanel() {
  const {activeTab, setActiveTab} = useActiveTab();
  return (
    <div className="h-full min-h-[90vh] flex-1 bg-[#0F0F0F]/75 rounded-xl py-2 overflow-y-auto">
      <ArrowLeftIcon onClick={() => setActiveTab(null)} className="size-6 m-4 block md:hidden text-[#BABABA]"/>
      {activeTab === "personal-information" && <Personal_information />}
      {activeTab === "blocked-users" && <BlockedUsers />}
      {activeTab === "security" && <Security />}
      {activeTab === "Game-settings" && <GameSettings />}
    </div>
  );
}
