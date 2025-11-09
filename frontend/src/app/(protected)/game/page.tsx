"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import GameSetup from "@/components/gameSetupComp/gameSetup";


export default function Game() {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [activeComponent, setActiveComponent] = useState("local");

  const localGameItems = [
    {
      titel: "Ping Pong",
      cover: "/Game/1v1_cover.png",
      alt: "1vs1 cover",
      description: "Play a single game against a friend.",
      button: "Start Game"
    },
    {
	 titel: "Tic Tac Toe",
	 cover: "/Game/XO.png",
	 alt: "XO game cover",
	 description: "Play a single game against a friend.",
	 button: "Start Game"
    }
  ];

  const LocalGame = ()=>
  {
    return (
      <div className='flex items-center  grid grid-cols-1 gap-6 md:grid-cols-2 w-full max-w-7xl'>

				<div className='rounded-3xl bg-gray-400/30 px-3 pt-3 text-center lg:ml-30'>
					<img src={localGameItems[0].cover} alt={localGameItems[0].alt} className='w-full h-90 object-cover rounded-xl'/>
					<h1 className='font-bold text-2xl pt-3 pb-1'>{localGameItems[0].titel}</h1>
					<p className='pb-3 text-[#D5D5D5]'>{localGameItems[0].description}</p>
		  		<Link href="/game/pingPong">
            <button className=' bg-[#181818]/65 hover:bg-[#1B1B1B]/65 mb-3 py-2 w-full rounded-lg \
            cursor-pointer shadow-md font-medium'
            onClick={() => setIsModalVisible(true)}>
              {localGameItems[0].button}
            </button>
					</Link>
          </div>

          <div className='rounded-3xl bg-gray-400/30 px-3 pt-3 text-center lg:mr-30'>
            <img src={localGameItems[1].cover} alt={localGameItems[1].alt} className='w-full h-90 object-cover rounded-xl'/>
            <h1 className='font-bold text-2xl pt-3 pb-1'>{localGameItems[1].titel}</h1>
            <p className='pb-3 text-[#D5D5D5]'>{localGameItems[1].description}</p>
            <button className=' bg-[#181818]/65 hover:bg-[#1B1B1B]/65 mb-3 py-2 w-full rounded-lg \
            cursor-pointer shadow-md font-medium'>
              {localGameItems[1].button}
            </button>
          </div>

        </div>
    )
  }

  return (
    //   <div className='absolute top-5 text-white flex flex-col inset-x-0 mx-5 items-center space-y-15'>
	  //  <LocalGame />
    //     {/* {activeComponent === "local" ? <LocalGame /> : <RemoteGame />} */}
    //     {/* <GameSetup isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} /> */}

    //     </div>
    <div>test</div>
  );
}