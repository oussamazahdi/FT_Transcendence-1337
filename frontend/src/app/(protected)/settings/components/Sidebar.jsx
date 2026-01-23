import React, { useContext } from "react";
import {
  NoSymbolIcon,
  UserIcon,
  LockClosedIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { ActiveTabContext } from "@/contexts/userContexts";

export default function Sidebar() {
  const {ActiveTab, setActiveTab} = useContext(ActiveTabContext);
  const menuItems = [
    {
      id: "personal-information",
      label: "Personal information",
      icon: UserIcon,
    },
    { id: "blocked-users", label: "Bolcked users", icon: NoSymbolIcon },
    { id: "security", label: "Security", icon: LockClosedIcon },
    { id: "Game-setiings", label: "Game setting", icon: WrenchScrewdriverIcon },
  ];

  return (
    <div className="h-full min-h-[90vh] shrink-0 bg-[#0F0F0F]/75 rounded-[12px] p-2 flex flex-col gap-2 overflow-y-auto">
      <h1 className="text-white text-xsm text-left font-bold md:p-4">
        Settings
      </h1>
      <div className="flex flex-col md:justify-start gap-2 w-full text-xs font-bold text-[#B3B3B3]">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center justify-start gap-2 p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-lg w-full h-12 cursor-pointer
						${
              ActiveTab === item.id
                ? "bg-[#414141]/60 text-white font-sans md:font-bold"
                : "text-gray-400 font-sans"
            }
						`}
          >
            <item.icon
              className={`${ActiveTab === item.id ? "brightness-150" : "brightness-60"} w-5 md:w-4`}
            />
            <p className="text-md md:text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
