import React from "react";
import Friends from './Friends'
import { assets } from '@/assets/data'

export default function SideBar ({onSelectFriend}){
	const friendsData = [
		{
		  playerPdp: assets.mohcinePdp,
		  playerName: "Mohcine Ghanami",
		  lastMessage: "Lorem ipsum is simply bla bla",
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
      <div>
        <div>
          <h1 className='font-bold text-xl'>Recent Messages</h1>
        </div>
        <div className='flex justify-between my-2'>
            <input className='h-7 bg-[#8D8D8D]/25 w-full px-2 rounded-sm placeholder:text-sm placeholder:text-gray-400' placeholder='Search'></input>
            <button><assets.MagnifyingGlassIcon className='p-1 rounded-sm bg-[#8D8D8D]/25 ml-1 w-7 cursor-pointer text-gray-300'/></button>
        </div>
        {friendComponents}
      </div>
	)
}