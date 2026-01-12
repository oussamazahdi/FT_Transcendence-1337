"use client";
import React, { use, useState, useEffect } from "react";
import { assets } from "@/assets/data";
import FriendsProfile from "./components/FriendsProfile";
import MatchPlayed from "../components/MatchPlayed";
import WinRate from "../components/WinRate";
import MatchHistory from "../components/MatchHistory";

//handle go back
const FriendProfilePage = ({ params }) => {
  const { id } = use(params);
  const [friendData, setFriendData] = useState(null);
  const [error, setError] = useState("")

  useEffect(() => {
    setError("")
    const fetchFriend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,{
          method:"GET",
          credentials:"include"
        });
        const data = await response.json();

        if (!response.ok){
          throw new Error(data.err)
        }
        setFriendData(data.userData);
      } catch (err) {
        console.log(err.message);
        setError(err.message)
      }
    };

    if (id) fetchFriend();
  }, [id]);

  if (!friendData) return <div className="text-white">Loading...</div>;
  return (
    <div className="flex w-full max-w-7xl mx-3 flex-col md:flex-row gap-4 h-[86vh]">
      <div className="flex flex-1 flex-col w-full basis-7/10 gap-4">
        <FriendsProfile userPage={friendData} />
        <div className="flex flex-1 flex-col md:flex-row justify-between gap-4">
          <MatchPlayed classname="max-h-[360px]"/>
          <WinRate />
        </div>
      </div>
      <div className="basis-3/10  flex flex-col gap-4">
        <MatchHistory classname="md:max-h-none" />
      </div>
    </div>
  );
};

export default FriendProfilePage;
