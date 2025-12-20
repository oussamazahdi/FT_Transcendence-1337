"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel";

export default function SettingsPage() {
  const [ActiveTab, setActiveTab] = useState("personal-information");
  return (
    <div className="flex w-full mx-3 lg:w-4/5 h-[80vh] overflow-hidden">
      <Sidebar ActiveTab={ActiveTab} setActiveTab={setActiveTab} />
      <SettingsPanel ActiveTab={ActiveTab} />
    </div>
  );
}
