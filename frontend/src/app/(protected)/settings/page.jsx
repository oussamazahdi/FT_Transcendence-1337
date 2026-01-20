"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel";
import { ActiveTabContext } from "@/contexts/userContexts";

export default function SettingsPage() {
  const [ActiveTab, setActiveTab] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setActiveTab("personal-information");
    }
  }, []);
  return (
    <ActiveTabContext.Provider value={{ActiveTab, setActiveTab}}>
      <div className="flex w-full max-w-7xl mx-auto h-[90vh] md:h-[86vh] gap-2 overflow-hidden">
        <div className={`w-full md:max-w-1/4 h-full ${ActiveTab ? "hidden md:block" : "block"}`}>
          <Sidebar />
        </div>
        <div className={`flex-1 h-full rounded-[12px] ${ActiveTab ? "block" : "hidden md:block"}`}>
          <SettingsPanel/>
        </div>
      </div>
    </ActiveTabContext.Provider>
  );
}
