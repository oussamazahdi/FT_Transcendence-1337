import React from "react";
import { assets } from "@/assets/data";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import { Gamepad2 } from "lucide-react";
import { friendsData2 } from "@/assets/mocData";

const renderFriends = friendsData2.map((user) => (
  <div
    key={user.id}
    className="flex items-center w-full bg-[#414141]/60 rounded-lg p-1 pr-2"
  >
    <Image
      src={user.avatar}
      alt="icon"
      width={40}
      height={40}
      className="rounded-md mr-1"
    />
    <div>
      <p className="text-xs font-bold">
        {user.firstname} [{user.username}]
      </p>
      <div className="flex items-center text-[9px] text-gray-500">
        <div
          className={`w-1.5 h-1.5 rounded-full mr-1 shrink-0 ${
            user.status === "Online" ? "bg-[#42A78A]" : "bg-[#B23B3B]"
          }`}
        />
        <p>{user.status}</p>
      </div>
    </div>
    <div className="ml-auto flex items-center gap-1">
      <button className="w-12 h-7 bg-[#151515]/70 flex justify-center items-center rounded-lg cursor-pointer hover:brightness-150 hover:scale-110">
        <Gamepad2 strokeWidth={1.5} className="size-4" />{" "}
      </button>
      <Link
        href={`/profile/${user.id}`}
        className="w-12 h-7 bg-[#151515]/70 flex justify-center items-center rounded-lg cursor-pointer hover:brightness-150 hover:scale-110"
      >
        <UserIcon className="size-4" />
      </Link>
    </div>
  </div>
));

const Friends = ({ classname }) => {
  return (
    <div
      className={`flex-1 bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}
    >
      <p className="font-bold text-sm shrink-0">Friends</p>
      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {renderFriends}
      </div>
    </div>
  );
};

export default Friends;
