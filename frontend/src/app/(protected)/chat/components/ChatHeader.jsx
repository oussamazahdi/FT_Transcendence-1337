import React, { useEffect, useRef, useState } from 'react'
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { UserIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import BlockUserPopUp from './BlockUserPopUp';

const ChatHeader = ({user}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowconfirm] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)){
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative bg-[#0F0F0F]/65 flex items-center p-2 rounded-lg gap-1">
      <Image src={user.avatar} alt="avatar" width={40} height={40} className="rounded-sm"/>
      <div className="flex flex-col">
        <p className="font-bold">{user.name}</p>
        <div className="flex items-center text-[9px] text-gray-500">
          <div 
            className={`w-1.5 h-1.5 rounded-full mr-1 shrink-0 ${
              user.status ? "bg-[#42A78A]" : "bg-[#B23B3B]"
            }`} 
            />
          {user.status ? <p>Online</p> : <p>Offline</p>}
        </div>
      </div>
      <div ref={ref} className='ml-auto'>
        <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer hover:scale-105"><EllipsisVertical className="size-6"/></button>
        {isOpen && 
          <div className='absolute right-0 top-full mt-2 rounded-lg w-48 bg-[#0F0F0F]/65 flex flex-col justify-center items-center gap-1 p-2 text-xs'>
            <Link href={`/profile/${user.id}`} className='w-full py-2 flex justify-center items-center gap-2 bg-[#252525] hover:bg-[#8D8D8D]/25 rounded-sm cursor-pointer'>
              <UserIcon className='size-3'/>
              <p>View profile</p>
            </Link>
            <button onClick={() => {setShowconfirm(true); setIsOpen(false)}} className='w-full py-2 flex justify-center items-center gap-2 bg-[#252525] hover:bg-[#8D8D8D]/25 rounded-sm cursor-pointer'>
              <XCircleIcon className='size-3 text-[#B03333]'/>
              <p className='text-[#B03333]'>Block Friend</p>
            </button>
          </div>}
        {showConfirm && 
        <BlockUserPopUp user={user} setShowconfirm={setShowconfirm}/>}
      </div>
    </div>
  )
}

export default ChatHeader
