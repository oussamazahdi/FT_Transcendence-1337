"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
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
import NotificationDropDown from "./NotificationDropDown";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon },
    { href: "/game", label: "Game", icon: TrophyIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon },
  ];

  const hardNavigate = (href: string) => {
    if (pathname !== href) {
      window.location.href = href;
    }
  };

  return (
    <header className="relative pt-4 mx-4 md:mx-10">
      <div className="flex items-center justify-between ">

        <button onClick={() => hardNavigate("/dashboard")}>
          <Image
            src="/logo.png"
            alt="logo"
            width={52}
            height={52}
            className="rounded-lg hover:opacity-90"
          />
        </button>

        <nav className="hidden md:flex items-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => hardNavigate(item.href)}
                className={`px-4 py-2 rounded-full border border-[#BEBEBE] text-sm
                  hover:bg-black/40 hover:text-white
                  ${isActive ? "bg-black/40 shadow-2xl backdrop-blur-xl ring-1 ring-white/15 text-white" : "text-[#BEBEBE]"}`}>
                {item.label}
              </button>
            );
          })}
        </nav>

        <Search />

        <div className="hidden md:block">
          <UserDropdown />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <NotificationDropDown
            containerClassName="relative md:hidden"
            buttonClassName="border border-[#9D9D9D]/40 rounded-[10px] p-2.5 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative"
            panelClassName="absolute right-0 top-full mt-2 max-h-64 w-64 bg-[#0F0F0F]/95 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar"
          />
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-black/20"
          >
            <Bars3Icon className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-72 h-full bg-[#0f0f0f] p-6 flex flex-col">

            <button
              onClick={() => setOpen(false)}
              className="self-end mb-6"
            >
              <XMarkIcon className="w-7 h-7 text-white" />
            </button>

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

            <div className="flex flex-col gap-4 mt-auto">
              <button
                onClick={() => hardNavigate("/profile")}
                className="flex gap-3 text-white/70 cursor-pointer"
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
