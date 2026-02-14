"use client"
import React, { useEffect, useState } from "react";
import LeaderboardCard from "./components/LeaderboardCard";
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Leaders } from "@/types";
import { autofetch } from "@/lib/api.tsx";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leaders[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState<number>(0)
  const itemsPerPage = 10;
  const [displayedPage, setDisplayedPage] = useState(1);

  const fetchLeaders = async (page: number) => {
    setLoading(true);
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard/?page=${page}`, {
        method: "get",
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        setLeaders(data.result);
        setCount(data.totalUsers);
        setDisplayedPage(page);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    const handler = setTimeout(() => {
      fetchLeaders(currentPage);
    }, 200); 

    return () => clearTimeout(handler);
  }, [currentPage]);

  const rankedLeaders = leaders.map((leader, index) => ({
    ...leader,
    rank: (index + 1) + ((displayedPage - 1) * 10)
  }));

  const totalPages = Math.ceil(count / itemsPerPage);

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

  const renderLeaders = rankedLeaders.map((user) => (
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
    <div className="bg-[#0F0F0F]/65 h-[86vh] w-[90vw] flex flex-col px-4 pt-4 pb-2 gap-4 rounded-xl">
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
        {loading ? 
          <div className="h-full w-full flex justify-center items-center">
            <svg  className="w-20 h-20" fill="#909090" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="12" r="3" opacity="1"><animate id="spinner_qYjJ" begin="0;spinner_t4KZ.end-0.25s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></circle><circle cx="12" cy="12" r="3" opacity=".4"><animate begin="spinner_qYjJ.begin+0.15s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></circle><circle cx="20" cy="12" r="3" opacity=".3"><animate id="spinner_t4KZ" begin="spinner_qYjJ.begin+0.3s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></circle></svg>  
          </div>
          :(error ? <p className="text-red-600 text-sm text-center px-6 py-2 bg-red-300/20 border mt-2 rounded">
            {error}
          </p>
            :renderLeaders ) 
        }
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
