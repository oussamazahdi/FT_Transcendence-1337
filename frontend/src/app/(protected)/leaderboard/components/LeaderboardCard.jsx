import React from 'react'
import Image from 'next/image'

const LeaderboardCard = ({name, avatar, level, rank}) => {
  const progressLvl = Math.round((level % 1) * 100);
  return (
    <div className={`w-full bg-[#3A3A3A]/60 hover:bg-[#3A3A3A] flex justify-between items-center p-1 md:pr-13 gap-2 rounded-lg
      ${rank == 1 && "bg-[#C7962B]/60 hover:bg-[#C7962B]"} 
      ${rank == 2 && "bg-[#8C8C8C]/60 hover:bg-[#8C8C8C]"}
      ${rank == 3 && "bg-[#9B4B19]/60 hover:bg-[#9B4B19]"}
      `}>
      <div className='flex items-center gap-2 w-1/2'>
        <Image 
          src={avatar}
          alt='avatar'
          className='rounded-sm w-12 h-12'
          />
        <p className='font-bold text-xs md:text-sm'>{name}</p>
      </div>
      <div className='flex flex-col min-w-30 justify-center items-center'>
        <div className='pr-4'>{level}</div>
        <div className="w-full bg-[#000000] rounded-full h-2.5">
            <div 
                className="bg-[#D9D9D9] h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressLvl}%` }}
            ></div>
        </div>
      </div>
      <div className='pr-4 font-bold'>{rank}</div>
    </div>
  )
}

export default LeaderboardCard
