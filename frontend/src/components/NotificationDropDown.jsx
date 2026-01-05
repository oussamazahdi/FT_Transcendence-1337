import React, { useRef, useState, useEffect } from 'react'
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { assets } from '@/assets/data';
import Image from 'next/image';

const GameInvite = ({ notif, onAccept, onReject }) => (
  <div className='bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition'>
    <div className='flex-shrink-0'>
      <Image 
        src={notif.user.avatar} 
        alt='avatar' 
        width={36} 
        height={36} 
        className='rounded-[6px] object-cover'
      />
    </div>
    <div className='flex flex-col flex-1 items-start'>
      <p className='text-[9px] text-white'>{notif.user.username} invited you to Ping Pong game</p>
      <div className='flex mt-1 gap-2'>
        <button 
          onClick={(e) => { e.stopPropagation(); onReject?.(notif.id); }}
          className='bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-[2px] rounded '
        >
          Reject
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAccept?.(notif.id); }}
          className='bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px]  px-2 py-[2px] rounded '
        >
          Accept
        </button>
      </div>
    </div>
  </div>
)

const MessageNotif = ({ notif }) => (
  <div className='bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition'>
    <Image src={notif.user.avatar} alt='avatar' width={36} height={36} className='rounded-[6px]'/>
    <div className='flex flex-col flex-1 min-w-0'>
      <p className='text-[9px] truncate text-white'>{notif.user.username} sent you a message:</p>
      <p className='text-[8px] truncate text-[#929292]'>{notif.message}</p>
    </div>
  </div>
)

const FriendInvite = ({ notif, onAccept, onReject }) => (
  <div className='  bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition'>
    <Image src={notif.user.avatar} alt='avatar' width={36} height={36} className='rounded-[6px]'/>
    <div className='flex flex-col flex-1 items-start'>
      <p className='text-[9px] truncate text-white'>{notif.user.username} sent you a friend invitation</p>
      <div className='flex mt-1 gap-2'>
        <button 
          onClick={(e) => { e.stopPropagation(); onReject?.(notif.id); }}
          className='bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px]  px-2 py-[2px] rounded '
        >
          Reject
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAccept?.(notif.id); }}
          className='bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px]  px-2 py-[2px] rounded '
        >
          Accept
        </button>
      </div>
    </div>
  </div>
)

const NOTIFICATION_COMPONENTS = {
  "Game invitation": GameInvite,
  "message": MessageNotif,
  "Friend invitation": FriendInvite,
}

const NotificationData = [
  {id:"1", user:{id:"user1", username:"Sarif", avatar:assets.soufiixPdp}, type:"Game invitation"},
  {id:"2", user:{id:"user2", username:"Sarif", avatar:assets.soufiixPdp}, type:"message", message:"hello, how are you! can we play a game bla bla"},
  {id:"3", user:{id:"user3", username:"Sarif", avatar:assets.soufiixPdp}, type:"Friend invitation"},
  {id:"4", user:{id:"user4", username:"Sarif", avatar:assets.soufiixPdp}, type:"Game invitation"},
  {id:"5", user:{id:"user5", username:"Sarif", avatar:assets.soufiixPdp}, type:"message", message:"hello, how are you! can we play a game bla bla"},
  {id:"6", user:{id:"user6", username:"Sarif", avatar:assets.soufiixPdp}, type:"Friend invitation"},
]

const NotificationDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(NotificationData);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccept = (notifId) => {
    console.log('Accepted notification:', notifId);
    // Remove notification after accepting
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const handleReject = (notifId) => {
    console.log('Rejected notification:', notifId);
    // Remove notification after rejecting
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const renderNotifications = notifications.map((notif) => {
    const SpecificComponent = NOTIFICATION_COMPONENTS[notif.type];
    if (!SpecificComponent) return null;
    return (
      <SpecificComponent 
        key={notif.id} 
        notif={notif}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    );
  });

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition"
      >
        <BellAlertIcon className="h-5 w-5 text-white/60" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2   max-h-[300px] bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar">
          {notifications.length > 0 ? (
            renderNotifications
          ) : (
            <p className="text-[10px] text-white/60 text-center py-4">No notifications</p>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropDown;