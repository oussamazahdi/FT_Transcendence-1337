"use client"

import React from 'react'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {usePathname} from 'next/navigation'
import { MagnifyingGlassIcon, BellAlertIcon, HomeIcon, 
         ChatBubbleOvalLeftIcon, TrophyIcon, 
         ChartBarIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {href: "/", label: "Dashboard", icon: HomeIcon},
    {href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon},
    {href: "/game", label: "Game", icon: TrophyIcon},
    {href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon},
  ]

  return (
      <div className='absolute top-5 inset-x-0 flex items-center justify-center'>
        <div className='hidden md:flex items-center gap-10 md:gap-10 lg:gap-35 bg-[#8D8D8D]/25 px-3 py-3 rounded-full '>
          <Link href="/">
            <img src="/logo.png" alt="logo" className='h-13 h-13 object-cover rounded-full' />
          </Link>
         <div className='flex items-center'>
          {navItems.map((item)=>(
            <Link key={item.href} href={item.href} >
              <button className={cn("flex items-center text-[#BEBEBE] hover:text-white cursor-pointer py-2 px-3",
              pathname === item.href &&  "flex items-center text-white font-medium bg-[#959595]/40 py-2 px-3 rounded-full shadow-md")}>
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

