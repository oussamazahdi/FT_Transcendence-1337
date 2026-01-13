import React from "react";
import { NoSymbolIcon, UserIcon, LockClosedIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export default function Sidebar({ ActiveTab, setActiveTab }) {
  const menuItems = [
    {id: "personal-information", label: "Personal information",icon: UserIcon},
    { id: "blocked-users", label: "Bolcked users", icon: NoSymbolIcon },
    { id: "security", label: "Security", icon: LockClosedIcon },
    { id: "Game-setiings", label: "Game setting", icon: WrenchScrewdriverIcon },
  ];

  return (
    <div className="w-full md:w-80 shrink-0 bg-[#0F0F0F]/75 rounded-[12px] p-2 flex flex-col md:gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
      <h1 className="text-white text-xsm text-center md:text-left font-bold md:p-4">Settings</h1>
      <div className="flex flex-row md:flex-col justify-between md:justify-start md:gap-2 w-full h-full px-6 md:p-4 text-xs font-bold text-[#B3B3B3]">
        {menuItems.map((item) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            className={`flex items-center justify-center md:justify-start gap-2 p-2 hover:bg-[#414141]/60 rounded-lg w-20 md:w-full h-full md:h-12 cursor-pointer
            ${
              ActiveTab === item.id
                ? "bg-[#414141] text-white font-sans md:font-bold"
                : "hover:bg-[#414141]/60 text-gray-400 font-sans"
            }
            `}
          >
            <item.icon
              className={`${ActiveTab === item.id ? "brightness-150" : "brightness-60"} w-5 md:w-4`}
            />
            <p className="hidden md:block">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
