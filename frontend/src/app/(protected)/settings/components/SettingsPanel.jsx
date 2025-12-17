import React from "react";
import Personal_information from "./personal-information";
import BlockedUsers from "./blocked-users";
import Security from "./security";
import GameSettings from "./Game-setiings";

export default function SettingsPanel({ ActiveTab }) {
  return (
    <div className="flex-1 bg-[#0F0F0F]/75 h-full rounded-[12px]">
      {ActiveTab === "personal-information" && <Personal_information />}
      {ActiveTab === "blocked-users" && <BlockedUsers />}
      {ActiveTab === "security" && <Security />}
      {ActiveTab === "Game-setiings" && <GameSettings/>}
    </div>
  );
}
