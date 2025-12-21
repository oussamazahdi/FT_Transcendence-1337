import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'

const friendsData = [
  {id:"1", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"2", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"3", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
  {id:"4", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"5", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"6", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
  {id:"7", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"8", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"9", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
  {id:"10", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"11", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"12", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
  {id:"13", firstname:"Kamal", username:"kael-ala", status:"Online", avatar:assets.kamalPdp},
  {id:"14", firstname:"Soufiane", username:"soufiix", status:"Offline", avatar:assets.soufiixPdp},
  {id:"15", firstname:"Mohdcine", username:"mghalmi", status:"Offline", avatar:assets.mohcinePdp},
]

const renderFriends = friendsData.map((user) => (
  <div key={user.id} className='flex items-center w-full bg-[#414141]/60 rounded-lg p-1 pr-2'>
    <Image src={user.avatar} alt="icon" width={40} height={40} className='rounded-md mr-1'/>
    <div>
      <p className='text-xs font-bold'>{user.firstname} [{user.username}]</p>
      <div className="flex items-center text-[9px] text-gray-500">
        <div 
          className={`w-1.5 h-1.5 rounded-full mr-1 shrink-0 ${
            user.status === "Online" ? "bg-[#42A78A]" : "bg-[#B23B3B]"
          }`} 
        />
        <p>{user.status}</p>
      </div>
    </div>
    <div className='ml-auto flex items-center gap-1'>
        <button><Image src={assets.gamepadeButton} alt='icon' width={52} height={52} className='cursor-pointer hover:brightness-150 hover:scale-110'/> </button>
        <button><Image src={assets.profileButton} alt='icon' width={52} height={52} className='cursor-pointer hover:brightness-150 hover:scale-110'/></button>
    </div>
  </div>
))

const Friends = () => {
  return (
    <div className=" basis-1/2 bg-[#0F0F0F]/75 rounded-[20px] p-3 h-1/2 flex flex-col">
      <p className='font-bold text-sm shrink-0'>Friends</p>
      <div className='flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0'>
        {renderFriends}
      </div>
    </div>
  )
}

export default Friends
