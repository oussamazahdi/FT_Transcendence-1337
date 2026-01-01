import React, { useRef, useState, useEffect} from 'react'
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { assets } from '@/assets/data';
import Image from 'next/image';

const GameInvite = ({notif}) => (
  <div className='w-54 bg-[#414141]/70 p-1 flex rounded-[8px] gap-1 cursor-pointer hover:bg-[#414141]'>
    <Image src={notif.user.avatar} alt='icon' width={36} height={36} className='rounded-[6px]'/>
    <div className='flex flex-col items-center'>
      <p className='text-[9px]'>{notif.user.username} invite you to Ping Ping game</p>
      <div className='flex mt-1 gap-2'>
        <button className='bg-[#8D4646] text-[8px] text-[#D63A3A] px-2 py-[2px] rounded-xs hover:bg-[#8D4646]/50 cursor-pointer'>Reject</button>
        <button className='bg-[#468C74] text-[8px] text-[#3AD6A7] px-2 py-[2px] rounded-xs hover:bg-[#468C74]/50 cursor-pointer'>Accept</button>
      </div>
    </div>
  </div>
)

const MessageNotif = ({notif}) => (
  <div className='w-54 bg-[#414141]/70 p-1 flex rounded-[8px] gap-1 cursor-pointer hover:bg-[#414141]'>
    <Image src={notif.user.avatar} alt='icon' width={36} height={36} className='rounded-[6px]'/>
    <div className='flex flex-col justify-start flex-1 min-w-0 pr-4'>
      <p className='text-[9px]'>{notif.user.username} send you message:</p>
      <p className='text-[8px] truncate text-[#929292]'>{notif.message}</p>
    </div>
  </div>
)

const FriendInvite = ({notif}) =>  (
  <div className='w-54 bg-[#414141]/70 p-1 flex rounded-[8px] gap-1 cursor-pointer hover:bg-[#414141]'>
    <Image src={notif.user.avatar} alt='icon' width={36} height={36} className='rounded-[6px]'/>
    <div className='flex flex-col items-center'>
      <p className='text-[9px]'>{notif.user.username} send you friend invitation</p>
      <div className='flex mt-1 gap-2'>
        <button className='bg-[#8D4646] text-[8px] text-[#D63A3A] px-2 py-[2px] rounded-xs hover:bg-[#8D4646]/50 cursor-pointer'>Reject</button>
        <button className='bg-[#468C74] text-[8px] text-[#3AD6A7] px-2 py-[2px] rounded-xs hover:bg-[#468C74]/50 cursor-pointer'>Accept</button>
      </div>
    </div>
  </div>
)

const NOTIFICATION_COMPONENTS = {
  "Game invitation" : GameInvite,
  "message" : MessageNotif,
  "Friend invitation" : FriendInvite,
}


const NotificationData = [
  {id:"1", user:{id:"", username:"Sarif", avatar:assets.soufiixPdp}, type:"Game invitation"},
  {id:"2", user:{id:"", username:"Sarif", avatar:assets.soufiixPdp}, type:"message", message:"hello, how are you! can we play a game bla bla"},
  {id:"3", user:{id:"", username:"Sarif", avatar:assets.soufiixPdp}, type:"Friend invitation"},
  {id:"4", user:{id:"", username:"Sarif", avatar:assets.soufiixPdp}, type:"Game invitation"},
  {id:"5", user:{id:"", username:"Sarif", avatar:assets.soufiixPdp}, type:"message", message:"hello, how are you! can we play a game bla bla"},
  {id:"6", user:{id:"", username:"Sarif", avatar:assets.soufiixPdp}, type:"Friend invitation"},
]

const NotificationDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderNotification = NotificationData.map((notif) => {
    const SpecificComponent = NOTIFICATION_COMPONENTS[notif.type];
    if (!SpecificComponent)
        return null;

    return(
      <div key={notif.id}>
            <SpecificComponent notif={notif} />
      </div>
    )
  })

  return (
    <div ref={ref} className="relative hidden md:block">
      <button onClick={()=> setIsOpen(!isOpen)} className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95">
        <BellAlertIcon className="size-5 text-white/60" />
      </button>
      {isOpen && (
        <div className="absolute h-37 right-1 top-full mt-5 w-56 bg-[#000000]/70 rounded-[10px] flex flex-col justify-start items-center text-white p-1 z-10 gap-1 overflow-y-auto custom-scrollbar ">
          {renderNotification}
        </div>
      )}
    </div>
  )
}

export default NotificationDropDown
