import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'

const Profile = ({user}) => {
  return (
    <div className="relative bg-[#0F0F0F]/75 rounded-[20px] h-[36vh]">
      <Image src={assets.coverPicture} alt="cover" width={800} height={50} className='rounded-[10px] p-3 w-full'/>
      <div className='absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Image src={user.avatar} alt='profile picture' width={120} height={120} className='rounded-[10px] ml-8' />
        <p className='text-white font-bold'>{user.firstname} {user.lastname} <span className='text-gray-500 font-thin text-sm'>[@{user.username}]</span></p>
      </div>
    </div>
  )
}

export default Profile
