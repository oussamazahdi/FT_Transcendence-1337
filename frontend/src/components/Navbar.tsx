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
      
      // ✅ Fetch with credentials (includes cookies)
      const response = await fetch('http://localhost:3001/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // ✅ This sends cookies automatically
        // ❌ No Authorization header needed!
      });

      // if (!response.ok) {
      //   throw Error('Failed to fetch user profile');
      // }

      const data = await response.json();
      // console.log('✅ User profile fetched:', data);
      setUser(data.user);

    } catch (err: any) {
      console.error('❌ Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {href: "/dashboard", label: "dashboard", icon: HomeIcon},
    {href: "/chat", label: "Chat", icon: ChatBubbleOvalLeftIcon},
    {href: "/game", label: "Game", icon: TrophyIcon},
    {href: "/leaderboard", label: "Leaderboard", icon: ChartBarIcon},
  ]
  const [search, setSearch] = useState('');
  return (
      <div className="relative mt-8 mx-20 lg:mx-35 flex justify-between">
      <div>
        <Link href="/dashboard">
          <img
            src="/logo.png"
            alt="logo"
            className="h-13 w-13 object-cover rounded-[10px]"
          />
        </Link>
      </div>

      <div className="flex items-center">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button
              className={`${
                pathname === item.href || pathname.startsWith(item.href)
                  ? " text-white font-medium bg-[#000000]/60 py-2 px-4 mx-2 rounded-full shadow-md transition delay-20 duration-200 "
                  : "mx-2 text-[#BEBEBE] border border-[#9D9D9D]/40 hover:text-white hover:bg-[#000000]/40 rounded-full cursor-pointer py-2 px-4"
              }`}
            >
              {item.label}
            </button>
          </Link>
        ))}
      </div>

      <div className="flex items-center my-2 border border-[#9D9D9D]/65 py-2 pl-4 text-white/60 rounded-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 border-none bg-transparent focus:outline-none text-white/80 placeholder-white/40"
        />
        <MagnifyingGlassIcon className="w-6 h-6 ml-3 mr-3 text-white/60" />
      </div>
          <div className='flex items-center gap-3' >
            <button className="border border-[#9D9D9D]/40 rounded-[10px] p-3 hover:bg-[#000000]/40 cursor-pointer">
              <BellAlertIcon className="w-5 h-5 text-white/60" />
            </button>
          {loading ? (
            <div className='h-13 w-13 rounded-[10px] bg-gray-400 animate-pulse' />
          ) : user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={52}
              height={52}
              className="h-13 w-13 object-cover rounded-[10px] ml-4"
            />
          ) : (
            <div className='h-13 w-13 rounded-[10px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:shadow-lg transition'>
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      </div>
    // </div>
  );
}

