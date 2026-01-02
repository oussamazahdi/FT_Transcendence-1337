"use client"
import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import { useAuth } from '@/contexts/authContext'

const WinOrLose = (player1, player2) => {
  
}
const MatchHistoryData = [
  {id:'1', player1:{username:"sarif", avatar:assets.soufiixPdp, score:"10"}, player2:{username:"ozahdi", avatar:assets.mohcinePdp, score:"8"}, createdAt:"25/11/2025 10:55" },
  {id:'2', player1:{username:"kael-ala", avatar:assets.kamalPdp, score:"9"}, player2:{username:"sarif", avatar:assets.soufiixPdp, score:"14"}, createdAt:"25/11/2025 10:55" },
  {id:'3', player1:{username:"ozahdi", avatar:assets.mohcinePdp, score:"17"}, player2:{username:"kael-ala", avatar:assets.kamalPdp, score:"0"}, createdAt:"25/11/2025 10:55" },
  {id:'4', player1:{username:"sarif", avatar:assets.soufiixPdp, score:"10"}, player2:{username:"ozahdi", avatar:assets.mohcinePdp, score:"8"}, createdAt:"25/11/2025 10:55" },
  {id:'5', player1:{username:"kael-ala", avatar:assets.kamalPdp, score:"9"}, player2:{username:"sarif", avatar:assets.soufiixPdp, score:"14"}, createdAt:"25/11/2025 10:55" },
  {id:'6', player1:{username:"ozahdi", avatar:assets.mohcinePdp, score:"17"}, player2:{username:"kael-ala", avatar:assets.kamalPdp, score:"0"}, createdAt:"25/11/2025 10:55" },
  {id:'7', player1:{username:"sarif", avatar:assets.soufiixPdp, score:"10"}, player2:{username:"ozahdi", avatar:assets.mohcinePdp, score:"8"}, createdAt:"25/11/2025 10:55" },
  {id:'8', player1:{username:"kael-ala", avatar:assets.kamalPdp, score:"9"}, player2:{username:"sarif", avatar:assets.soufiixPdp, score:"14"}, createdAt:"25/11/2025 10:55" },
  {id:'9', player1:{username:"ozahdi", avatar:assets.mohcinePdp, score:"17"}, player2:{username:"kael-ala", avatar:assets.kamalPdp, score:"0"}, createdAt:"25/11/2025 10:55" },
]

const renderHistory = MatchHistoryData.map((match) => (
  <div key={match.id} className='flex justify-between items-center w-full h-12 bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141]'>
    <div className="flex items-center flex-1 gap-2 min-w-0 justify-start">
      <Image src={match.player1.avatar} alt='avatar' width={40} height={40} className='rounded-md shrink-0'/>
      <p className='text-xs font-bold truncate'>{match.player1.username}</p>
    </div>
    <div className='flex flex-col justify-center items-center w-24 shrink-0'>
      <p className='text-sm font-bold whitespace-nowrap'>{match.player1.score} - {match.player2.score}</p>
      <p className='text-[10px] text-gray-400 whitespace-nowra'>{match.createdAt}</p>
    </div>
    <div className='flex items-center justify-end flex-1 gap-2 min-w-0'>
      <p className='text-xs font-bold truncate'>{match.player2.username}</p>
      <Image src={match.player2.avatar} alt='avatar' width={40} height={40} className='rounded-md shrink-0'/>
    </div>
  </div>
))

const MatchHistory = ({height}) => {
  const {user} = useAuth();

  return (
    <div className={`flex-1 min-h-0 max-h-[350px] md:max-h-none bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col`}>
      <p className='font-bold text-sm shrink-0'>Match history</p>
      <div className='flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0'>
        {renderHistory}
      </div>
    </div>
  )
}

export default MatchHistory
