"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/data";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "dashboard", icon: assets.dashboardIcon },
    { href: "/chat", label: "Chat", icon: assets.chatIcon },
    { href: "/game", label: "Game", icon: assets.pingPongIcon },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: assets.leaderboardIcon,
    },
  ];
  const [search, setSearch] = useState("");

  const navBareMap = navItems.map((item) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`mx-2 text-[#BEBEBE] p-1 focus:border-b-2 focus:border-white md:border md:border-[#BEBEBE] hover:text-white hover:bg-[#000000]/40 md:focus:bg-[#000000]/40 md:rounded-full cursor-pointer md:py-2 md:px-4 ${isActive ? "md:bg-[#000000]/40" : ""}`}
      >
        <Image
          src={item.icon}
          alt="icon"
          width={32}
          height={32}
          className="block md:hidden"
        />
        <p className="hidden md:block">{item.label}</p>
      </Link>
    );
  });

  return (
    <div className="relative ml-2 mt-2 md:mt-8 md:mx-10 lg:mx-35 flex justify-between">
      <div className="w-full flex items-center justify-between">
        <Link href="/dashboard" className="hidden md:block shrink-0">
          <Image
            src="/logo.png"
            alt="logo"
            width={52}
            height={52}
            className="object-cover size-12 md:size-14 rounded-[10px] hover:scale-105"
          />
        </Link>
        <div className="flex items-center justify-evenly flex-1 md:justify-center md:flex-none">
          {navBareMap}
        </div>

        <div className="hidden md:flex items-center md:my-2 md:border border-[#9D9D9D]/65 md:py-2 md:pl-4 text-white/60 rounded-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="border-none bg-transparent focus:outline-none text-white/80 placeholder-white/40"
          />
          <MagnifyingGlassIcon className="size-6 md:w-6 md:h-6 md:mx-3 text-white/60" />
        </div>

        <button className="md:hidden p-2 text-white/60 hover:bg-black/20 rounded-full">
          <Image src={assets.searchIcon} alt="icon" className="size-8 mr-4" />
        </button>
        <UserDropdown />
      </div>
    </div>
  );
}
