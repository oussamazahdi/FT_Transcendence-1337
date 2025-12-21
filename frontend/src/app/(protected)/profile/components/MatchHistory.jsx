import React from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'

const WinOrLose = (player1, player2) => {


}
const MatchHistoryData = [
  {id:'1', player1:{username:"sarif", avatar:assets.soufiixPdp, score:"10"}, player2:{username:"ozahdi", avatar:assets.mohcinePdp, score:"8"}, createdAt:"25/11/2025 10:55" },
  {id:'2', player1:{username:"kael-ala", avatar:assets.kamalPdp, score:"9"}, player2:{username:"sarif", avatar:assets.soufiixPdp, score:"14"}, createdAt:"25/11/2025 10:55" },
  {id:'3', player1:{username:"ozahdi", avatar:assets.mohcinePdp, score:"17"}, player2:{username:"kael-ala", avatar:assets.kamalPdp, score:"0"}, createdAt:"25/11/2025 10:55" },
]

const renderHistory = MatchHistoryData.map((match) => (
  <div key={match.id} className='flex justify-between items-center w-full bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141]'>
    <Image src={match.player1.avatar} alt='avatar' width={40} height={40} className='rounded-md mr-1'/>
    <p className='text-xs font-bold mr-auto'>{match.player1.username}</p>
    <div className='flex flex-col justify-center items-center gap-1'>
      <p className='text-sm font-bold'>{match.player1.score} - {match.player2.score}</p>
      <p className='text-xs text-gray-500'>{match.createdAt}</p>
    </div>
    <p className='text-xs font-bold ml-auto'>{match.player2.username}</p>
    <Image src={match.player2.avatar} alt='avatar' width={40} height={40} className='rounded-md ml-1'/>
  </div>
))

const MatchHistory = () => {
  return (
    <div className='basis-1/2 bg-[#0F0F0F]/75 rounded-[20px] p-3 h-1/2 flex flex-col'>
      <p className='font-bold text-sm shrink-0'>Match history</p>
      <div className='flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0'>
        {renderHistory}
      </div>
    </div>
  )
}

export default MatchHistory
