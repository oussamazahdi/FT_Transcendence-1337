import React from "react";
import { assets } from "@/assets/data";
import Image from "next/image";

export default function Sidebar({ ActiveTab, setActiveTab }) {
  const menuItems = [
    {id: "personal-information", label: "Personal information",icon: assets.personal,},
    { id: "blocked-users", label: "Bolcked users", icon: assets.block },
    { id: "security", label: "Security", icon: assets.lock },
    { id: "Game-setiings", label: "Game setting", icon: assets.gamepad },
  ];

  return (
    <div className="bg-[#0F0F0F]/75 min-w-[250px] w-[40vh] max-w-[350px] mr-2 h-full flex flex-col rounded-[12px]">
      <h1 className="text-white text-xsm font-bold p-4">Settings</h1>
      <div className="flex flex-col gap-2 w-full h-full p-4 text-xs font-bold text-[#B3B3B3]">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
            }}
            className={`flex items-center gap-2 p-2 hover:bg-[#414141]/60 rounded-lg h-12 cursor-pointer
						${
              ActiveTab === item.id
                ? "bg-[#414141] text-white font-bold"
                : "hover:bg-[#414141]/60 text-gray-400"
            }
						`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={16}
              height={16}
              className={`${ActiveTab === item.id ? "brightness-100" : "brightness-60"}`}
            />
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
