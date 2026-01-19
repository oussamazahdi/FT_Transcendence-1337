import React, { useEffect, useState } from "react";
import FriendCard from "./FriendCard";
import { useAuth } from "@/contexts/authContext";


const Friends = ({ classname }) => {
  const {friends} = useAuth();
  // const [FriendsData, setFriendsData] = useState([]);
  // const [error, setError] = useState("");

  // useEffect(() => {

  //   setError("");

  //   const fetchFriends = async () => {
  //     try{
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/`,{
  //         method:"GET",
  //         credentials:"include"
  //       })

  //       const data = await response.json()
  //       if (!response.ok){
  //         throw new Error (data.error);
  //       }
  //       setFriendsData(data.friendList);
  //     }catch(err){
  //       setError(err.message);
  //       console.log(err.message)
  //     }
  //   }
  //   fetchFriends();
  // },[])

  const renderFriends = friends.map((user) => (
    <FriendCard user={user} key={user.id}/>
  ));

  return (
    <div
      className={`flex-1 bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}
    >
      <p className="font-bold text-sm shrink-0">Friends</p>
      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {renderFriends}
      </div>
    </div>
  );
};

export default Friends;
