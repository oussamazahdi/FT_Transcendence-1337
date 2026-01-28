"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel";
import { ActiveTabContext } from "@/contexts/userContexts";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const [ActiveTab, setActiveTab] = useState(null);
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
    <ActiveTabContext.Provider value={{ActiveTab, setActiveTab}}>
      <div className="flex w-full max-w-7xl mx-auto h-full md:h-[86vh] gap-2">
        <div className={`w-full md:max-w-1/4 h-full ${ActiveTab ? "hidden md:block" : "block"}`}>
          <Sidebar />
        </div>
        <div className={`flex-1 h-full rounded-xl ${ActiveTab ? "block" : "hidden md:block"}`}>
          <SettingsPanel/>
        </div>
      </div>
    </ActiveTabContext.Provider>
  );
}
