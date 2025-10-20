"use client"

import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import { MagnifyingGlassIcon, BellAlertIcon,
         ChatBubbleOvalLeftIcon, TrophyIcon, 
         ChartBarIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {href: "/", label: "Dashboard", icon: Squares2X2Icon},
    {href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon},
    {href: "/game", label: "Game", icon: TrophyIcon},
    {href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon},
  ]
  const buttonStyle = "flex items-center text-[#BEBEBE] hover:text-white cursor-pointer py-2 px-3"
  return (
      <div className='absolute top-5 inset-x-0 flex items-center justify-center'>
        <div className='hidden md:flex justify-between items-center  bg-[#8D8D8D]/25 px-3 py-3 rounded-full w-3/4 lg:w-3/5 '>
          <Link href="/">
            {/* <img src="/logo.png" alt="logo" className='h-13 h-13 object-cover rounded-full' /> */}
            <img src="/logo.png" alt="" className='h-13 rounded-full' />
          </Link>
         <div className='flex items-center'>
          {navItems.map((item)=>(
            <Link key={item.href} href={item.href} >
              <button className={
              `${pathname === item.href ?"flex items-center text-white font-medium bg-[#959595]/40 py-2 px-4 rounded-full shadow-md" : "flex items-center text-[#BEBEBE] hover:text-white cursor-pointer py-2 px-4"  }`}>
                <item.icon className='h-4 w-4 mr-1' />
                {item.label}
              </button>
            </Link>
          ))}
          </div>
          <div className='flex items-center gap-3' >
            <MagnifyingGlassIcon className="h-11 w-11 p-2.5 text-white bg-[#D9D9D9]/40 rounded-full" />
            <BellAlertIcon className="h-11 w-11 p-2.5 text-white bg-[#D9D9D9]/40 rounded-full" />
          <img src="/Profile.jpeg" alt="" className='h-13 rounded-full' />
        </div>
      </div>
    </div>
  );
}

