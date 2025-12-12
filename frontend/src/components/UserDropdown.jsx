import React from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/authContext";

const UserDropdown = () => {
  const { user, isLoading } = useAuth();
  return (
    <div>
      <div className="flex items-center gap-3">
        <button className="border border-[#9D9D9D]/40 rounded-[10px] p-3 hover:bg-[#000000]/40 cursor-pointer">
          <BellAlertIcon className="w-5 h-5 text-white/60" />
        </button>
        {isLoading ? (
          <div className="h-14 w-14 rounded-[10px] bg-gray-400 animate-pulse" />
        ) : user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            width={52}
            height={52}
            className="h-14 w-14 object-cover rounded-[10px]"
          />
        ) : (
          <div className="h-14 w-14 rounded-[10px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:shadow-lg transition">
            {user?.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
