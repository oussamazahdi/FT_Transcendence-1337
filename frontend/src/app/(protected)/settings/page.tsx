"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel.tsx";
import { ActiveTabContext } from "@/contexts/userContexts.ts";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");


  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setActiveTab("personal-information");
    }
  }, []);
  useEffect(() => {
    if(tab)
      setActiveTab(tab);
  },[tab])
  return (
    <ActiveTabContext.Provider value={{activeTab, setActiveTab}}>
      <div className="flex w-[90vw] mx-auto h-full md:h-[86vh] gap-2">
        <div className={`w-full md:max-w-1/4 h-full ${activeTab ? "hidden md:block" : "block"}`}>
          <Sidebar />
        </div>
        <div className={`flex-1 h-full rounded-xl ${activeTab ? "block" : "hidden md:block"}`}>
          <SettingsPanel/>
        </div>
      </div>
    </ActiveTabContext.Provider>
  );
}
