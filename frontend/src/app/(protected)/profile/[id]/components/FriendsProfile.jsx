"use client"
import React, { useState } from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import Link from 'next/link'
import { ChatBubbleOvalLeftIcon, NoSymbolIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { Gamepad2 } from 'lucide-react'
import RemoveUserConf from './RemoveUserConf'

const FriendsProfile = ({ user }) => {
  const [showConfirm, setShowconfirm] = useState(false)

  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] h-[36vh]">
      <div className="relative w-full h-[26vh] p-3 overflow-hidden">
        <Image src={assets.coverPicture} alt="cover" width={800} height={50} className='object-cover w-full h-full rounded-[10px]' />
      </div>
      <div className='absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col justify-center items-center'>
        {(user?.avatar && user?.avatar !== "null") ? 
            <Image src={user.avatar} alt='profile picture' width={120} height={120} className='size-20 md:size-28 rounded-[10px]' />
          : <Image src={assets.defaultProfile} alt="avatar" height={80} width={80} className="rounded-[10px]" />}
        <p className='text-white font-bold'>{user.firstname} {user.lastname} <span className='text-gray-500 font-thin text-sm'>[@{user.username}]</span></p>
        <div className='flex gap-2 mt-1'>
          <button className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
            <UserPlusIcon className='size-4 brightness-150'/>
            Add friend</button>
          <Link href={`/chat`} className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <ChatBubbleOvalLeftIcon className='size-4 brightness-150'/>
          </Link>
          <button className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <Gamepad2 strokeWidth={1.5} className='size-4 brightness-150' />
          </button>
          <button onClick={() => setShowconfirm(true)} className="flex justify-center items-center p-2 bg-[#583636]/40 hover:bg-[#583636] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <NoSymbolIcon className='size-4 brightness-150 text-[#D92F2F]'/>
          </button>
        </div>
      </div>
      {showConfirm &&
        <RemoveUserConf user={user} setShowconfirm={setShowconfirm}/>
      }
    </div>
  )
}

export default FriendsProfile
