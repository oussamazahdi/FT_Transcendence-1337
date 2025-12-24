"use client"
import React, { use, useState, useEffect } from 'react'
import { assets } from '@/assets/data';
import FriendsProfile from './components/FriendsProfile';
import MatchPlayed from '../components/MatchPlayed';
import WinRate from '../components/WinRate';
import MatchHistory from '../components/MatchHistory';

//handle go back
const FriendProfilePage = ({params}) => {
  const {id} = use(params)
  const [friendData, setFriendData] = useState(null);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`);
        // const data = await res.json();
        const data = {id:"1", firstname:"Kamal", lastname:"EL Alami", username:"kael-ala", status:"Online", avatar:assets.kamalPdp}
        setFriendData(data);
      } catch (err) {
        console.log("User not found");
      }
    };
    
    if (id) fetchFriend();
  }, [id]);

  if (!friendData) return <div className="text-white">Loading...</div>;
  return (
    <div className="flex w-full mx-3 lg:w-4/5 h-[80vh] overflow-hidden gap-4">
      <div className="flex flex-col w-full basis-7/10 gap-4">
        <FriendsProfile user={friendData}/>
        <div className="flex justify-between h-[44vh] gap-4">
          <MatchPlayed/>
          <WinRate/>
        </div>
      </div>
      <div className="basis-3/10  flex flex-col gap-4">
        <MatchHistory height="h-full flex-1"/>
      </div>
    </div>
  )
}

export default FriendProfilePage
