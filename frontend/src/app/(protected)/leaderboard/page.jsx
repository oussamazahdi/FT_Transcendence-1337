"use client"
import React, { useState } from "react";
import { friendsData2 } from "@/assets/mocData";
import LeaderboardCard from "./components/LeaderboardCard";
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function leaderboard() {
  const [friends, setfriends] = useState(friendsData2);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedList = friends.sort((a, b) => b.level - a.level);
  const rankedFriends = sortedList.map((friend, index) => ({
    ...friend, 
    rank: index + 1
  }))
  const currentItems = rankedFriends.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(friends.length / itemsPerPage);

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

  const renderLeaders = currentItems.map((user, index) => (
      <LeaderboardCard 
        key={user.id}
        name={user.firstname + " " + user.lastname}
        avatar={user.avatar}
        level={user.level}
        rank={user.rank}
      />
  ))

  return (
    <div className="bg-[#0F0F0F]/65 h-[86vh] w-full max-w-7xl flex flex-col px-4 pt-4 pb-2 gap-4 rounded-[12px]">
      <div className="flex flex-row font-bold text-sm md:text-xl justify-between md:pr-10">
        <p className="w-1/2"></p>
        <p>Level</p>
        <p>Rank</p>
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
        <div className="size-8 text-xl font-bold border-1 pt-[2px] text-center border-white rounded-sm bg-white/10">{currentPage}</div>
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
