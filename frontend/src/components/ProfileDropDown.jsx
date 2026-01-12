"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const ProfileDropDown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (response.ok) router.push("/");
    } catch (error) {
      console.log(error.error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative size-12 md:size-14 rounded-[12px] flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-105 active:scale-95 overflow-hidden cursor-pointer"
      >
        <div className="h-full w-full  bg-white/10 flex items-center justify-center overflow-hidden">
          {user?.avatar && user.avatar !== "null" ? (
            <img
              src={user.avatar}
              alt={user.username || "User avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={assets.defaultProfile}
              alt="avatar"
              height={80}
              width={80}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </button>
      {isOpen ? (
        <div className="absolute right-1 top-full mt-5 w-36 md:w-56 bg-[#000000]/75 rounded-[12px] flex flex-col justify-center items-center text-white font-medium p-2 z-10">
          <ul className="w-full space-y-1">
            <Link
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              href="/profile"
              className="h-8 md:h-10  flex justify-start items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors"
            >
              <UserIcon className="size-4 md:size-6" />
              <p>Profile</p>
            </Link>
            <Link 
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              href="/friendsRequests"
              className="h-8 md:h-10  flex justify-start items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors">
                <UsersIcon className="size-4 md:size-6" />
                <p>Friends Requests</p>
            </Link>
            <Link
              onClick={() => setIsOpen(!isOpen)}
              href="/settings"
              className="h-8 md:h-10  w-full max-w-52 flex justify-start items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors"
            >
              <Cog6ToothIcon className="size-4 md:size-6" />
              <p>Settings</p>
            </Link>
            <div
              onClick={() => handleSignOut()}
              className="h-8 md:h-10  w-full max-w-52 flex justify-start items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors"
            >
              <ArrowRightStartOnRectangleIcon className="size-4 md:size-6 text-[#DD4949]" />
              <p className="text-[#DD4949]">Sign out</p>
            </div>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileDropDown;
