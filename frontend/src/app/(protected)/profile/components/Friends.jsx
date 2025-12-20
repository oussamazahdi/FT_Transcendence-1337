import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'

const friends = [
  {id:"1", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"2", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"3", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
  {id:"4", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"5", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"6", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
]

const renderFriends = friends.map((user) => (
  <div key={user.id} className='flex items-center w-full h-full bg-[#414141]/60 rounded-lg p-1'>
    <Image src={user.avatar} alt="icon" width={50} height={50} className='rounded-md mr-6'/>
    <div>
      <p className='text-xs font-bold'>{user.firstname} [{user.username}]</p>
      <div className="flex items-center text-xs">
        {user.status === "Online" ? <p>🟢</p> : <p>🔴</p>}
        <p>{user.status}</p>
      </div>
    </div>
    <div className='bg-[#0F0F0F]/75 w-15 h-7'>
      <button><Image src={assets.gamepad} alt='icon' width={4} height={4} className='p-2'/> </button>
    </div>
    <div className='bg-[#0F0F0F]/75 w-15 h-7'>
      <button><Image src={assets.profile} alt='icon' width={4} height={4} className='p-2'/></button>
    </div>
  </div>
))

const Friends = () => {
  return (
    <div className="bg-[#0F0F0F]/75 basis-2/7 rounded-[12px] p-2">
      <p className='font-bold text-sm'>Friends</p>
      <div className='flex flex-col gap-1 w-full'>
        {renderFriends}
      </div>
    </div>
  )
}

export default Friends
