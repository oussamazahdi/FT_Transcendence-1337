import React from 'react'
import SideBar from './components/SideBar.jsx'
import ChatPage from './components/ChatPage.jsx'
import { useState } from 'react';




export default function chat() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div  className='flex w-full min-w-100 mx-3 lg:w-3/5 min-h-[80vh] bg-[#8D8D8D]/25 rounded-xl overflow-hidden min-h-100'>
      <div className='w-1/3 min-w-[250px] max-w-[350px] bg-[#1A1A1A]/75 p-3'>
        <SideBar onSelectFriend={setSelectedFriend}/>
      </div>
      <div className='flex-1 bg-[#8D8D8D]/25 p-4 h-full'>
        <ChatPage friend={selectedFriend}/>
      </div>
    </div>
  );
}