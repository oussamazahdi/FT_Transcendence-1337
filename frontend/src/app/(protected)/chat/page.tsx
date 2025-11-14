'use client'
import React from 'react'
import SideBar from './components/SideBar.jsx'
import ChatPage from './components/ChatPage.jsx'
import { useState } from 'react';




export default function chat() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div  className='flex w-full min-w-100 mx-3 lg:w-4/5 min-h-[80vh] rounded-lg overflow-hidden'>
      <div className='min-w-[250px] max-w-[350px] mr-2'>
        <SideBar onSelectFriend={setSelectedFriend}/>
      </div>
      <div className='flex-1 bg-[#8D8D8D]/25 h-full rounded-lg'>
        <ChatPage friend={selectedFriend}/>
      </div>
    </div>
  );
}