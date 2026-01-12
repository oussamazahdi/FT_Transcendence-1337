"use client"
import React, { useEffect, useState } from 'react'
import FriendsRequests from './components/FriendsRequests'
import PendingRequests from './components/PendingRequests'
import { useAuth } from '@/contexts/authContext'

const friendsRequestsPage = () => {
  const [openFriendReqs, setOpenFriendReqs] = useState(true);
  const {refreshFriendReq} = useAuth();

  useEffect(()=>{
    refreshFriendReq();
  },[])
  return (
    <div className='md:w-7xl md:h-[86vh] flex flex-col bg-[#0F0F0F]/75 rounded-xl gap-4 md:px-60'>
      <div className='w-full flex justify-center py-4 relative border-b border-gray-700/50'>
        <div onClick={() => setOpenFriendReqs(true)} className="w-full text-xl flex justify-center font-bold cursor-pointer z-10">Friends Requests</div>
        <div onClick={() => setOpenFriendReqs(false)} className="w-full text-xl flex justify-center font-bold cursor-pointer z-10">Pending Requests</div>
        <div className={`absolute bottom-0 h-1 bg-white w-1/2 transition-all duration-300 ${openFriendReqs ? "left-0" : "left-1/2"}`}/>
      </div>
      {openFriendReqs ?  
      <FriendsRequests/>
      :<PendingRequests/>
      }
    </div>
  )
}

export default friendsRequestsPage
