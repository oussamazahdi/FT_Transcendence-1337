import React from 'react'
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect, useRef } from 'react';

const UserDropdown = () => {
  const {user} = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <div className="flex items-center gap-3">
        <button className="border border-[#9D9D9D]/40 rounded-[10px] p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95">
          <BellAlertIcon className="w-5 h-5 text-white/60" />
        </button>
        <button className="relative h-14 w-14 rounded-[12px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-105 active:scale-95 overflow-hidden p-[2px] cursor-pointer">
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
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#000000]/70 rounded-[12px]">
            <ul>
              <li>profile</li>
              <li>settings</li>
              <li>sign Out</li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default UserDropdown
