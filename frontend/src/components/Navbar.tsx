"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {usePathname} from 'next/navigation'
import { MagnifyingGlassIcon, BellAlertIcon, HomeIcon, 
        	ChatBubbleOvalLeftIcon, TrophyIcon, 
        	ChartBarIcon } from '@heroicons/react/24/outline'

interface User{
  id: number;
  username: string;
  email: string;
  avatar: string;
}

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:3001/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      console.log('✅ User profile fetched:', data);
      setUser(data.user);

    } catch (err: any) {
      console.error('❌ Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {href: "/Dashboard", label: "Dashboard", icon: HomeIcon},
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
          {loading ? (
            <div className='h-13 w-13 rounded-full bg-gray-400 animate-pulse' />
          ) : user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={52}
              height={52}
              className='h-13 w-13 rounded-full object-cover border-2 border-white/20 cursor-pointer hover:border-white/50 transition'
            />
          ) : (
            <div className='h-13 w-13 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:shadow-lg transition'>
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

