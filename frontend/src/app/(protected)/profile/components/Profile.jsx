import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'

const Profile = ({ user }) => {

  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] h-[36vh]">
      <Image src={assets.coverPicture} alt="cover" width={800} height={50} className='rounded-[10px] p-3 w-full' />
      <div className='absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col justify-center items-center'>
      {(user?.avatar && user?.avatar !== "null") ? 
          <Image src={user.avatar} alt='profile picture' width={120} height={120} className='rounded-[10px]' />
        : <Image src={assets.defaultProfile} alt="avatar" height={80} width={80} className="rounded-[10px]" />
      }
        <p className='text-white font-bold'>{user.firstname} {user.lastname} <span className='text-gray-500 font-thin text-sm'>[@{user.username}]</span></p>
      </div>
    </div>
  )
}

export default Profile
