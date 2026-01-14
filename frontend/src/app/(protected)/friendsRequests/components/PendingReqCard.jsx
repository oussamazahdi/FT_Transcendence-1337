import { assets } from '@/assets/data'
import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/authContext'


const PendingReqCard = ({user}) => {
  const {cancelRequest} = useAuth();
  return (
    <div className='flex flex-col justify-between w-full h-50 bg-[#242526] rounded-xl overflow-hidden border border-[#3e4042]'>
      <div className="relative h-[65%] w-full bg-gray-700">
        <Image 
          src={user.avatar || assets.defaultProfile}
          alt="avatar"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col p-2 gap-2 h-[35%] justify-center">
        <h3 className="text-white font-bold text-xs truncate">
            {user.firstname} {user.lastname}
        </h3>
        <button onClick={() => cancelRequest(user)} className='w-full bg-[#8D4646] hover:bg-[#8D4646]/60 text-[#D63A3A] text-xs font-semibold py-1.5 rounded-md cursor-pointer transition-colors'>
            Cancel
        </button>
      </div>
    </div>
  )
}

export default PendingReqCard
