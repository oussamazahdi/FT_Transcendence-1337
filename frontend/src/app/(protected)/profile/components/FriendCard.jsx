import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import { Gamepad2 } from "lucide-react";
import { assets } from '@/assets/data';

const FriendCard = ({user}) => {
  return (
    <div
      key={user.id}
      className="flex items-center w-full bg-[#414141]/60 rounded-lg p-1 gap-1"
    >
      <div className='size-10 flex items-center overflow-hidden rounded-sm'>
        <Image
          src={user?.avatar || assets.defaultProfile}
          alt="icon"
          width={40}
          height={40}
          className="object-cover"
          />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-xs font-bold truncate">
          {user.firstname} {user.lastname}
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
          <Gamepad2 className="size-4" />{" "}
        </button>
        <Link
          href={`/profile/${user.id}`}
          className="w-12 h-7 bg-[#151515]/70 flex justify-center items-center rounded-lg cursor-pointer hover:brightness-150 hover:scale-110"
        >
          <UserIcon className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default FriendCard
