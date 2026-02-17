"use client";
import React, { useEffect, useState } from "react";
import { parseTime } from "@/lib/utils"
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import { assets } from "@/assets/data";


const MatchHistory = ({ classname, id }:any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matcheHistory, setMatcheHestory] = useState<any[]>([])

  useEffect(()=>{
    setError("")
    const fetchMatchHistory = async() => {
      setLoading(true);
      try{
        const response = await fetch((`${process.env.NEXT_PUBLIC_API_URL}/api/game/history?id=${id}`),{credentials:"include"})

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Fetch matches history failed")

        const matches = data.data
        setMatcheHestory(matches);
      }catch(err:any){
        setError(err.message)
      }finally{
        setLoading(false)
      }
    }
    
    fetchMatchHistory();
  },[id])

  const winLose = (winner:any) => {
    if (user?.id == winner)
      return true
    else
      return false
  };
  
  const renderHistory = matcheHistory.map((match:any) => {
    const iWon = winLose(match.winner_id)
    return(
      <div
        key={match.id}
        className={`flex justify-between items-center w-full h-16 ${iWon ? " bg-[#42A78A]/30" : "bg-[#B23B3B]/30 "} rounded-lg p-1 `}
      >
        <div className="w-full flex items-center flex-1 gap-2 min-w-0 justify-start">
          <div className="relative overflow-hidden w-14 h-14 rounded-sm shrink-0">
              <Image
                src={match.player1_avatar || assets.defaultProfile}
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs font-bold truncate w-full">{match.player1_username}</p>
          </div>
        <div className="flex flex-col justify-center items-center w-20 shrink-0">
          <p className="text-sm font-bold">{iWon ? "Win" : "Lose"}</p>
          <p className="text-sm font-bold whitespace-nowrap">
            {match.player1_score} - {match.player2_score}
          </p>
          <p className="text-[10px] text-gray-400">
            {parseTime(match.created_at)}
          </p>
        </div>
        <div className="w-full flex items-center justify-end flex-1 gap-2 min-w-0">
          <p className="text-xs text-right font-bold truncate w-full">{match.player2_username}</p>
          <div className="relative overflow-hidden w-14 h-14 rounded-sm shrink-0">
            <Image
              src={match.player2_avatar || assets.defaultProfile}
              alt="avatar"
              fill
              className="object-cover"
              />
          </div>
        </div>
      </div>)
});

  return (
    <div className={`min-h-0 h-full bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}>
      <p className="font-bold text-sm shrink-0">Match history</p>
      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {loading ?
        <p>Loading...</p>
        : renderHistory
        }
      </div>
    </div>
  );
};

export default MatchHistory;