import React from "react";
import Friends from './Friends'
import { assets } from '@/assets/data'

export default function SideBar ({onSelectFriend}){
	const friendsData = [
		{
		  playerPdp: assets.mohcinePdp,
		  playerName: "Mohcine Ghanami",
		  lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
		  timeOfLastMsg: "11:08",
		  status: true,
		  key : "id1"
		},
		{
		  playerPdp: assets.soufiixPdp,
		  playerName: "Soufiane arif",
		  lastMessage: "Lorem ipsum is simply bla bla",
		  timeOfLastMsg: "20/09/2025",
		  status: true,
		  key : "id2"
		},
		{
		  playerPdp: assets.kamalPdp,
		  playerName: "Kamal El Alami",
		  lastMessage: "Lorem ipsum is simply bla bla",
		  timeOfLastMsg: "20/09/2025",
		  status: true,
		  key : "id3"
		},
	  ]

	const friendComponents = friendsData.map((friend)=>{
		  return (
			<Friends
			  pdp = {friend.playerPdp}
			  name = {friend.playerName}
			  lastmsg = {friend.lastMessage}
			  time = {friend.timeOfLastMsg}
			  key = {friend.key}
			  onClick={() => onSelectFriend(friend)}
			/>
	  
		  )
		})
		return (
      <div className="flex flex-col">
        <div className='flex justify-between bg-[#1A1A1A]/75 mb-2 rounded-lg'>
            <input className='h-10 w-full px-2 placeholder:text-sm placeholder:text-gray-400 hover:bg-[#8D8D8D]/25 hover:rounded-lg focus:outline-none ' placeholder='Search'></input>
            {/* <button><assets.MagnifyingGlassIcon className='p-1 rounded-sm bg-[#8D8D8D]/25 ml-1 w-7 cursor-pointer text-gray-300'/></button> */}
        </div>
				<div className="bg-[#1A1A1A]/75 rounded-lg px-2 min-h-[80vh]">
					<h1 className="font-bold px-2 py-4">Messages</h1>
        	{friendComponents}
				</div>
      </div>
	)
}