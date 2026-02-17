import React from 'react'
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { assets } from '@/assets/data';
import { useAuth } from '@/contexts/authContext';
import { otherUserData } from '@/types';

interface blockedCardProp{
  user:otherUserData
}
const BlockedCard = ({user}:blockedCardProp) => {
  const {unblockUser} = useAuth();

  return (
    <div className="w-full mx-2 max-w-200 h-14 md:mx-4 rounded-sm bg-[#414141]/35 flex items-center gap-1 p-1 hover:bg-[#414141] cursor-pointer">
      <div className='w-12 h-12 overflow-hidden rounded-xs'>
        <Image
          src={user?.avatar || assets.defaultProfile}
          width={48}
          height={48}
          alt="avatar"
          className="rounded-xs"
          />
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-2 md:mx-2">
        <p className="text-xs md:text-sm font-bold">
          {user.firstname} {user.lastname}
        </p>
        <p className="text-xs/3 md:text-xs text-[#909090]">{`[@${user.username}]`}</p>
      </div>
      <button onClick={() => unblockUser(user)} className="ml-auto mr-1 md:mr-2 hover:scale-105 cursor-pointer transition-all duration-150 flex gap-1 rounded-full border-1 p-2">
        <CheckCircleIcon className="w-4 h-4" />
        <p className="text-xs">Unblock</p>
      </button>
    </div>
  )
}

export default BlockedCard
