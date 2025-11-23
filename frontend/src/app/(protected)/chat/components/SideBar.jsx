import React, { useEffect, useState } from "react";
import Friends from './Friends'
import { assets } from '@/assets/data'

// interface Friend {
// 	id:number,
// 	playerName:string,
// 	playerPdp:string,
// 	lastMessage:string,
// 	timeOfLastMsg:string,
// 	status:boolean,
// }

// interface User {
//   id: number;
//   firstname: string;
//   lastname: string;
//   profilepicture: string;
//   email?: string;
//   username?: string;
// }



// const SearchIcon = ({ className }: { className: string }) => (
// 	<svg 
// 		xmlns="http://www.w3.org/2000/svg" 
// 		viewBox="0 0 24 24" 
// 		fill="none" 
// 		stroke="currentColor" 
// 		strokeWidth="2" 
// 		strokeLinecap="round" 
// 		strokeLinejoin="round" 
// 		className={className}
// 	>
// 	<circle cx="11" cy="11" r="8" />
// 	<path d="m21 21-4.3-4.3" />
// 	</svg>
// 	);

// const LoaderIcon = ({ className }: { className: string }) => (
// 	<svg 
// 		xmlns="http://www.w3.org/2000/svg" 
// 		viewBox="0 0 24 24" 
// 		fill="none" 
// 		stroke="currentColor" 
// 		strokeWidth="2" 
// 		strokeLinecap="round" 
// 		strokeLinejoin="round"
// 		className={className}
// 	>
// 	<path d="M21 12a9 9 0 1 1-6.219-8.56" />
// 	</svg>
// );

export default function SideBar ({onSelectFriend}){
	const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

	
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

		// useEffect(() => {
		// 	if (!searchQuery.trim()) {
		// 		setSearchResults([]);
		// 		setLoading(false);
		// 		return;
		// 	}
    // 	const delayDebounceFn = setTimeout(async () => {
		// 		setLoading(true);
		// 		try {

		// 			const token = localStorage.getItem('token'); 
		// 			const response = await fetch (`http://localhost:3001/api/users/search?query=${searchQuery}`, {
		// 				method: 'GET',
		// 				 headers: {
		// 					'Content-Type': 'application/json',
		// 					'Authorization': `Bearer ${token}`
    //       	}
		// 			})
		// 			console.log(`Fetching: http://localhost:3001/api/users/search?query="${searchQuery}"`);

		// 			if(!response.ok){
		// 				throw new Error('failed to fetch users');
		// 			}

		// 			const data = await response.json();
					
		// 			setSearchResults(data);

		// 		} catch (error) {
		// 			console.error("Error fetching users:", error);
		// 		} finally {
		// 			setLoading(false);
		// 		}
    // }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchQuery]);


	// const renderList = () => {
  //   if (loading) {
  //     return (
  //       <div className="flex flex-col items-center justify-center py-8 text-gray-400">
  //         <LoaderIcon className="w-6 h-6 animate-spin mb-2" />
  //         <span className="text-sm">Searching users...</span>
  //       </div>
  //     );
  //   }

  //   if (searchQuery.length > 0) {
  //     if (searchResults.length === 0) {
  //       return <div className="text-center text-gray-500 py-4">No users found</div>;
  //     }

  //     return searchResults.map((user) => (
  //       <Friends
  //         pdp={user.profilepicture}
  //         name={`${user.firstname} ${user.lastname}`}
  //         lastmsg="Click to start chatting"
  //         time=""
  //         key={user.id} 
  //         onClick={() => onSelectFriend(user)}
  //       />
  //     ));
  //   }
	// }

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
            <input className='h-10 w-full px-2 placeholder:text-sm placeholder:text-gray-400 hover:bg-[#8D8D8D]/25 hover:rounded-lg focus:outline-none ' placeholder='Search' ></input>
        </div>
				<div className="bg-[#1A1A1A]/75 rounded-lg px-2 min-h-[80vh]">
					<h1 className="font-bold px-2 py-4">Messages</h1>
        	{friendComponents}
				</div>
      </div>
	)
}