"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel";

export default function SettingsPage() {
  const [ActiveTab, setActiveTab] = useState("personal-information");
  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto md:h-[86vh] gap-2">
      <Sidebar ActiveTab={ActiveTab} setActiveTab={setActiveTab} />
      <SettingsPanel ActiveTab={ActiveTab} />
    </div>
  );
}
