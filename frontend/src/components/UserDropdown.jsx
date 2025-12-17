import React from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/data";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserDropdown = () => {
  const { user } = useAuth();
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
    <div>
      <div className="flex items-center gap-3">
        <button className="border border-[#9D9D9D]/40 rounded-[10px] p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95">
          <BellAlertIcon className="w-5 h-5 text-white/60" />
        </button>
        <div ref={ref} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative h-14 w-14 rounded-[12px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-105 active:scale-95 overflow-hidden p-[2px] cursor-pointer"
          >
            <div className="h-full w-full rounded-[10px] bg-white/10 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || "User avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-bold text-xl drop-shadow-md">
                  {user?.username?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
          </button>
          {isOpen ? (
            <div className="absolute right-1 top-full mt-5 w-56 bg-[#000000]/70 rounded-[12px] flex flex-col justify-center items-center text-white font-medium p-2 z-10">
              <ul className="flex flex-col gap-1">
                <Link
                  href="/profile"
                  className="h-10 w-52 flex justify-center items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors"
                >
                  <Image
                    src={assets.profile}
                    alt="profile"
                    className="size-4"
                  />
                  <p>Profile</p>
                </Link>
                <Link
                  href="/settings"
                  className="h-10 w-52 flex justify-center items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors"
                >
                  <Image
                    src={assets.settings}
                    alt="settings"
                    className="size-4"
                  />
                  <p>Settings</p>
                </Link>
                <div
                  onClick={() => handleSignOut()}
                  className="h-10 w-52 flex justify-center items-center gap-3 rounded-[8px] hover:bg-[#414141]/70 cursor-pointer transition-colors"
                >
                  <Image
                    src={assets.signOut}
                    alt="signOut"
                    className="size-4"
                  />
                  <p className="text-[#DD4949]">Sign out</p>
                </div>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
