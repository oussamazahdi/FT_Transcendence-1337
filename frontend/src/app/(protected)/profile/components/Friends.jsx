import React, { useEffect, useState } from "react";
import FriendCard from "./FriendCard";
import { useAuth } from "@/contexts/authContext";


const Friends = ({ classname }) => {
  const {friends} = useAuth();


  const renderFriends = () => {
    if (!friends || friends.length === 0)
      return(<div className="text-sm text-center text-white/60 mt-4">No friends </div>)
    return(
      friends.map((user) => (<FriendCard user={user} key={user.id}/>)))
  }
    

  return (
    <div
      className={`flex-1 bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}
    >
      <p className="font-bold text-sm shrink-0">Friends</p>
      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {renderFriends()}
      </div>
    </div>
  );
};

export default Friends;
