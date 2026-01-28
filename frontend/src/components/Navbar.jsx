"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  TrophyIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/contexts/authContext";
import Search from "./Search";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {logout} = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon },
    { href: "/game", label: "Game", icon: TrophyIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon },
  ];

  // ✅ Hard reload navigation
  const hardNavigate = (href) => {
    if (pathname !== href) {
      window.location.href = href;
    }
  };

  return (
    <header className="relative mt-4 mx-4 md:mx-10">
      <div className="flex items-center justify-between ">

        {/* Logo */}
        <button onClick={() => hardNavigate("/dashboard")}>
          <Image
            src="/logo.png"
            alt="logo"
            width={52}
            height={52}
            className="rounded-lg hover:opacity-90"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => hardNavigate(item.href)}
                className={`px-4 py-2 rounded-full border border-[#BEBEBE] text-sm
                  hover:bg-black/40 hover:text-white
                  ${isActive ? "bg-black/60 text-white" : "text-[#BEBEBE]"}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Search */}
        {/* <div className="hidden md:flex items-center border border-[#9D9D9D]/60 rounded-full px-4 py-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none text-white placeholder-white/40"
          />
          <MagnifyingGlassIcon className="w-5 h-5 ml-2 text-white/60" />
        </div> */}
        <Search/>

        {/* Desktop User */}
        <div className="hidden md:block">
          <UserDropdown />
        </div>

        {/* Mobile Burger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-full hover:bg-black/20"
        >
          <Bars3Icon className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-72 h-full bg-[#0f0f0f] p-6 flex flex-col">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="self-end mb-6"
            >
              <XMarkIcon className="w-7 h-7 text-white" />
            </button>

            {/* Nav Links */}
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => hardNavigate(item.href)}
                  className="flex items-center gap-3 text-white/80 hover:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>

            <hr className="my-6 border-white/10" />

            {/* User Actions (NO IMAGE) */}
            <div className="flex flex-col gap-4 mt-auto">
              <button
                onClick={() => hardNavigate("/profile")}
                className="flex gap-3 text-white/70  cursor-pointer cursor-pointer"
              >
                <UserIcon className="w-5 h-5" />
                Profile
              </button>

              <button
                onClick={() => hardNavigate("/friendsRequests")}
                className="flex gap-3 text-white/70  cursor-pointer"
              >
                <UsersIcon className="w-5 h-5" />
                Friends requests
              </button>

              <button
                onClick={() => hardNavigate("/settings")}
                className="flex gap-3 text-white/70  cursor-pointer"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                Settings
              </button>

              <button onClick={() => logout()} className="flex gap-3 text-red-400  cursor-pointer">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
