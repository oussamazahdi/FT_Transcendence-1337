"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  BellAlertIcon,
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  TrophyIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import UserDropdown from "./UserDropdown";


export default function Navbar() {
  const pathname = usePathname();


  const navItems = [
    { href: "/dashboard", label: "dashboard", icon: HomeIcon },
    { href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon },
    { href: "/game", label: "Game", icon: TrophyIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon },
  ];
  const [search, setSearch] = useState("");
  
  const navBareMap= navItems.map((item) => {
    const isActive = pathname.startsWith(item.href);
    return(
    <Link 
      key={item.href}
      href={item.href} 
      className={`mx-2 text-[#BEBEBE] border border-[#BEBEBE] hover:text-white hover:bg-[#000000]/40 focus:bg-[#000000]/40 rounded-full cursor-pointer py-2 px-4 ${isActive ? "bg-[#000000]/40" : ""}`}>
        {item.label}
    </Link>
  )})

  return (
    <div className="relative mt-8 mx-4 md:mx-10 lg:mx-20 lg:mx-35 flex justify-between">
      <div>
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="logo"
            width={52}
            height={52}
            className="object-cover rounded-[10px]"
          />
        </Link>
      </div>

      <div className="flex items-center">
        {navBareMap};
      </div>

      <div className="flex items-center my-2 border border-[#9D9D9D]/65 py-2 pl-4 text-white/60 rounded-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 border-none bg-transparent focus:outline-none text-white/80 placeholder-white/40"
        />
        <MagnifyingGlassIcon className="w-6 h-6 ml-3 mr-3 text-white/60" />
      </div>
      <UserDropdown/>
    </div>
  );
}