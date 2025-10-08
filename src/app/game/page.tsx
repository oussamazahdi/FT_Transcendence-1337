"use client"
import React from 'react'
import { useState } from 'react';
import GameSetup from '@/components/gameSetupComp/gameSetup';

export default function Game() {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [activeComponent, setActiveComponent] = useState("local");

  const localGameItems = [
    {
      titel: "1vs1 Match",
      cover: "/Game/1v1_cover.png",
      alt: "1vs1 cover",
      description: "Play a single game against a friend.",
      button: "Start Game"
    },
    {
      titel: "Tournament",
      cover: "/Game/Tournament.png",
      alt: "Tounament cover",
      description: "Create your own tournament.",
      button: "Create Tournament"
    },
    {
      titel: "XO Match",
      cover: "/Game/XO.png",
      alt: "XO game cover",
      description: "Play a single game against a friend.",
      button: "Start Game"
    }
  ];
  const remoteGameItems = [
    {
      titel: "1vs1 Match",
      cover: "/Game/1v1_cover.png",
      alt: "1vs1 cover",
      description: "Play a single game against a friend.",
      rightButton: "Invite friend",
      leftButton: "Matchmaking"
    },
    {
      titel: "Tournament",
      cover: "/Game/Tournament.png",
      alt: "Tounament cover",
      description: "Create your own tournament.",
      rightButton: "Create",
      leftButton: "Join"
    },
    {
      titel: "XO Match",
      cover: "/Game/XO.png",
      alt: "XO game cover",
      description: "Play a single game against a friend.",
      rightButton: "Invite friend",
      leftButton: "Matchmaking"
    }
  ];

  const RemoteGame = ()=>{
    return (
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl'>
          {remoteGameItems.map((item)=>(
              <div key={item.titel} className='rounded-3xl bg-gray-400/30 px-3 pt-3 text-center'>
                <img src={item.cover} alt={item.alt} className='w-full h-64 object-cover rounded-xl'/>
                <h1 className='font-bold text-2xl pt-3 pb-1'>{item.titel}</h1>
                <p className='pb-3 text-[#D5D5D5]'>{item.description}</p>
                <div className='flex space-x-2'>
                  <button className=' bg-[#181818]/65 hover:bg-[#1B1B1B]/65  mb-3 py-2 w-full \
                  rounded-lg cursor-pointer shadow-md font-medium'>
                    {item.rightButton}
                  </button>
                  <button className=' bg-[#181818]/65 hover:bg-[#1B1B1B]/65  mb-3 py-2 w-full \
                  rounded-lg cursor-pointer shadow-md font-medium'>
                    {item.leftButton}
                  </button>
                </div>
              </div>
          ))}
        </div>
    )
  }
  const LocalGame = ()=>
  {
    return (
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl'>
          {localGameItems.map((item)=>(
              <div key={item.titel} className='rounded-3xl bg-gray-400/30 px-3 pt-3 text-center'>
                <img src={item.cover} alt={item.alt} className='w-full h-64 object-cover rounded-xl'/>
                <h1 className='font-bold text-2xl pt-3 pb-1'>{item.titel}</h1>
                <p className='pb-3 text-[#D5D5D5]'>{item.description}</p> 
                <button className=' bg-[#181818]/65 hover:bg-[#1B1B1B]/65 mb-3 py-2 w-full rounded-lg \
                cursor-pointer shadow-md font-medium'
                onClick={() => setIsModalVisible(true)}>
                  {item.button}
                </button>
              </div>
          ))}
        </div>
    )
  }

  return (
      <div className='absolute top-5 text-white flex flex-col inset-x-0 mx-5 items-center space-y-15'>
        <div className='space-x-2 p-2 bg-white/20 rounded-xl'>
          <button
            className={`py-2 px-10 rounded-lg cursor-pointer \
            ${activeComponent === "local" ? "bg-[#302F2E]  font-semibold" : "bg-[#6D6C6C]/50 text-white/70"}`}
            onClick={()=>{setActiveComponent("local")}}
          >Local</button>
          <button
            className={`py-2 px-9 rounded-lg cursor-pointer \
            ${activeComponent === "online" ? "bg-[#302F2E]  font-semibold px-8.5" : "bg-[#6D6C6C]/50 text-white/70"}`}
            onClick={()=>{setActiveComponent("online")}}
          >Online</button>
        </div>
        {activeComponent === "local" ? <LocalGame /> : <RemoteGame />}
        <GameSetup isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}/>
        </div>
  );
}