import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { Leaders } from '@/types';
import { assets } from '@/assets/data';


const LeaderboardCard = ({id, firstname, lastname, avatar, player_level, rank, player_xp, wins, loses, forfaits}:Leaders) => {
  const progressLvl = Math.round((player_level % 1) * 100);
  return (
    <div className={`grid grid-cols-[2fr_1fr_1fr_1fr]  md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full items-center p-1 bg-[#3A3A3A]/60 hover:bg-[#3A3A3A] rounded-lg
      ${rank == 1 && "bg-[#C7962B]/60 hover:bg-[#C7962B]"} 
      ${rank == 2 && "bg-[#8C8C8C]/60 hover:bg-[#8C8C8C]"}
      ${rank == 3 && "bg-[#9B4B19]/60 hover:bg-[#9B4B19]"}
      `}>
      <Link href={`/profile/${id}`} className='flex items-center gap-2 min-w-0'>
        <div className='relative h-12 w-12 overflow-hidden'>
          <Image src={avatar || assets.defaultProfile} alt='avatar' fill className='rounded-sm' />
        </div>
        <div className='flex flex-col md:flex-row md:gap-1 font-bold text-[10px] sm:text-xs md:text-sm truncate'>
          <p className="truncate">{firstname}</p>
          <p className="truncate">{lastname}</p> 
        </div>
      </Link>
<div className='text-center w-full truncate'>{player_level.toFixed(2)}</div>
      <div className='text-center w-full truncate'>{player_xp}</div>
      <div className='text-center w-full truncate hidden md:block'>{wins}</div>
      <div className='text-center w-full truncate hidden md:block'>{loses}</div>
      <div className='text-center w-full truncate hidden md:block'>{forfaits}</div>
      <div className='text-center w-full truncate font-bold'>{rank}</div>
      </div>
      )
}

export default LeaderboardCard
