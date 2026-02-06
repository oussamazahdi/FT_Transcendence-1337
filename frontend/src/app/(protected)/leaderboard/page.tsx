"use client"
import React, { useEffect, useState } from "react";
import LeaderboardCard from "./components/LeaderboardCard";
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Leaders } from "@/types";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leaders[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setError("");
    setLoading(true);
    const fetchLeaders = async () =>{
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`,{
          method:"get",
          credentials:"include" 
        });
        
        const data = await response.json();
        if (!response.ok){
          throw new Error(data.error || "faild to fetch leaders");
        }

        setLeaders(data.result)
        console.log(data);
      }catch(err:any){
        setError(err.message);
      }finally{
        setLoading(false);
      }
    }

    fetchLeaders();
    },[])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const rankedLeaders = leaders.map((leader, index) => ({
    ...leader, 
    rank: index + 1
  }))
  const currentItems = rankedLeaders.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(leaders.length / itemsPerPage);

  const handleFirst = () => {
    if (currentPage != 1) 
      setCurrentPage(1);
  }

  const handleNext = () => {
    if (currentPage < totalPages)
      setCurrentPage(currentPage + 1);
  }

  const handlePrev = () => {
    if (currentPage > 1)
      setCurrentPage(currentPage - 1);
  }

  const handleLast = () => {
    if (currentPage != totalPages)
      setCurrentPage(totalPages)
  }
  console.log(currentItems)

  const renderLeaders = currentItems.map((user) => (
      <LeaderboardCard key={user.id}
        id={user.id}
        username={user.username}
        firstname={user.firstname}
        lastname={user.lastname}
        avatar={user.avatar}
        player_level={user.player_level}
        player_xp={user.player_xp}
        rank={user.rank}
        wins={user.wins}
        forfaits={user.forfaits}
        loses={user.loses}
      />
  ))

  return (
    <div className="bg-[#0F0F0F]/65 h-[86vh] w-full max-w-7xl flex flex-col px-4 pt-4 pb-2 gap-4 rounded-xl">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] font-bold text-sm md:text-xl px-1">
        <p>Player</p>
        <p className="text-center">Level</p>
        <p className="text-center">XP</p>
        <p className="text-center hidden md:block">Win</p>
        <p className="text-center hidden md:block">Lose</p>
        <p className="text-center hidden md:block">Forfait</p>
        <p className="text-center">Rank</p>
      </div>
      <div className="flex flex-col justify-items-start items-center gap-2 overflow-y-auto custom-scrollbar">
        {renderLeaders}
      </div>
      <div className="flex-1 flex justify-center items-end -mt-4 gap-2">
        <button onClick={() => {handleFirst()} }className="size-8 border-1 border-white rounded-sm p-1 hover:bg-white/20 cursor-pointer">
          <ChevronDoubleLeftIcon className="size-6 "/>
        </button>
        <button onClick={() => {handlePrev()} }className="size-8 border-1 border-white rounded-sm p-1 hover:bg-white/20 cursor-pointer">
          <ChevronLeftIcon className="size-6 "/>
        </button>
        <div className="size-8 text-xl font-bold border pt-0.5 text-center border-white rounded-sm bg-white/10">{currentPage}</div>
        <button onClick={() => {handleNext()} }className="size-8 border-1 border-white rounded-sm p-1 hover:bg-white/20 cursor-pointer">
          <ChevronRightIcon className="size-6 "/>
        </button>
        <button onClick={() => {handleLast()} }className="size-8 border-1 border-white rounded-sm p-1 hover:bg-white/20 cursor-pointer">
          <ChevronDoubleRightIcon className="size-6 "/>
        </button>
      </div>
    </div>
  );
}
