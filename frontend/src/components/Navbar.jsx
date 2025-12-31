"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "@heroicons/react/24/outline";

import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "dashboard", icon: HomeIcon },
    { href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon },
    { href: "/game", label: "Game", icon: TrophyIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon },
  ];

  return (
    <nav className="relative mt-8 mx-4 md:mx-10 lg:mx-35">
      {/* Top bar (UNCHANGED for large screens) */}
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="logo"
            width={52}
            height={52}
            className="object-cover rounded-[10px]"
          />
        </Link>

        {/* Desktop nav (UNCHANGED) */}
        <div className="hidden lg:flex items-center">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mx-2 text-[#BEBEBE] border border-[#BEBEBE] hover:text-white hover:bg-[#000000]/40 rounded-full cursor-pointer py-2 px-4
                  ${isActive ? "bg-[#000000]/40" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop search (UNCHANGED) */}
        <div className="hidden lg:flex items-center my-2 border border-[#9D9D9D]/65 py-2 pl-4 rounded-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent focus:outline-none text-white/80 placeholder-white/40"
          />
          <MagnifyingGlassIcon className="w-6 h-6 mx-3 text-white/60" />
        </div>

        {/* Desktop profile (UNCHANGED) */}
        <div className="hidden lg:block">
          <UserDropdown />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white"
        >
          {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden mt-4 rounded-xl bg-black/80 p-4 backdrop-blur space-y-4">

          {/* Mobile nav links */}
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg
                  ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10"}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Mobile search */}
          <div className="flex items-center border border-white/30 rounded-full px-4 py-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent focus:outline-none text-white/80 placeholder-white/40 flex-1"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
          </div>

          {/* Mobile profile section (REPLACED) */}
          <div className="border-t border-white/10 pt-3 space-y-2">

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10"
            >
              <UserIcon className="w-5 h-5" />
              Profile
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </Link>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-white/10"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
