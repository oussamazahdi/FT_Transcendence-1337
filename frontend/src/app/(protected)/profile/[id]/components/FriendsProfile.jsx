"use client"
import React, { useState } from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import Link from 'next/link'

const FriendsProfile = ({ user }) => {
  const [showConfirm, setShowconfirm] = useState(false)

  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] h-[36vh]">
      <Image src={assets.coverPicture} alt="cover" width={800} height={50} className='rounded-[10px] p-3 w-full' />
      <div className='absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col justify-center items-center'>
        {(user?.avatar && user?.avatar !== "null") ? 
            <Image src={user.avatar} alt='profile picture' width={120} height={120} className='rounded-[10px]' />
          : <Image src={assets.defaultProfile} alt="avatar" height={80} width={80} className="rounded-[10px]" />}
        <p className='text-white font-bold'>{user.firstname} {user.lastname} <span className='text-gray-500 font-thin text-sm'>[@{user.username}]</span></p>
        <div className='flex gap-2 mt-1'>
          <button className="flex items-center gap-1 bg-[#414141]/60 hover:bg-[#414141] text-white px-3 py-1 rounded-sm text-[9px] transition-colors cursor-pointer hover:scale-105">
            <Image src={assets.addFriend} alt="icon" height={12} width={12}/>
            Add friend</button>
          <Link href={`/chat`} className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <Image src={assets.startConversation} alt="chat" height={12} width={12} />
          </Link>
          <button className="flex justify-center items-center p-2 bg-[#414141]/60 hover:bg-[#414141] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <Image src={assets.gamepad} alt='icon' height={12} width={12} className='brightness-150' />
          </button>
          <button onClick={() => setShowconfirm(true)}className="flex justify-center items-center p-2 bg-[#583636]/40 hover:bg-[#583636] rounded-sm transition-colors cursor-pointer hover:scale-105">
            <Image src={assets.block_User} alt='icon' height={12} width={12} className='brightness-150'/>
          </button>
        </div>
      </div>
      {showConfirm &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowconfirm(false)}></div>
        <div className="relative z-10 bg-[#0f0f0f] py-10 px-16 rounded-4xl shadow-2xl w-100 flex flex-col items-center ">
          <Image src={user.avatar} alt="icon" width={120} height={120} className='rounded-xl mb-2'/>
          <p className="font-bold text-2xl">Remove Friend</p>
          <p className="text-lg font-medium">
            {user.firstname} {user.lastname}
          </p>
          <p className='text-center text-gray-500 text-sm'>This person won’t be able to messageor invite you, They wont know you blocked theme</p>
          <div className="flex justify-center items-center gap-4">
            <button
              type="submit"
              onClick={()=> setShowconfirm(false)}
              className="w-30 h-8 text-xs font-medium rounded-sm mt-4 hover:bg-[#442222]/40 bg-[#442222] text-[#FF4848] cursor-pointer">
              Confirm
            </button>
            <button
              type="submit"
              onClick={()=> setShowconfirm(false)}
              className="w-30 h-8 text-xs font-medium rounded-sm mt-4 hover:bg-[#252525]/40 bg-[#252525] text-white hover:text-white cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default FriendsProfile
