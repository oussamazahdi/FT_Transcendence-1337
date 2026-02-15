"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GameSetup from "@/components/gameSetupComp/gameSetup";

const Games = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] p-2 flex flex-col h-full min-h-45 md:min-h-0">
      <div className="flex flex-col md:flex-row gap-2 w-full flex-1 min-h-0">

        <button type="button" onClick={() => setIsModalVisible(true)}
          className="relative flex-1 min-h-30 md:min-h-0 rounded-2xl overflow-hidden cursor-pointer
            transition-transform duration-200 hover:scale-[1.01] ring-1 ring-white/10 hover:ring-white/30 group">
          <Image src="/Local.png" alt="Local Game" fill sizes="(max-width: 768px) 100vw, 33vw" priority
            className="object-cover transition duration-300 grayscale-30 opacity-70 group-hover:grayscale-0 group-hover:opacity-100"/>

          <div className="absolute inset-0 flex flex-col items-center justify-center
              bg-black/50 group-hover:bg-black/25 transition duration-300 text-center">
            <span className="text-2xl font-extrabold tracking-wide italic text-white">Local Game</span>
            <span className="text-gray-300 text-xs mt-1">1 vs 1</span>
          </div>
        </button>

        <Link href="/game/matchmaking"
          className="relative flex-1 min-h-30 md:min-h-0 rounded-2xl overflow-hidden cursor-pointer
            transition-transform duration-200 hover:scale-[1.01] ring-1 ring-white/10 hover:ring-white/30 group">
          <Image src="/Remote.png" alt="Remote Game" fill sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 grayscale-30 opacity-70 group-hover:grayscale-0 group-hover:opacity-100"/>

          <div className="absolute inset-0 flex flex-col items-center justify-center
              bg-black/50 group-hover:bg-black/25 transition duration-300 text-center">
            <span className="text-2xl font-extrabold tracking-wide italic text-white">Remote Game</span>
            <span className="text-gray-300 text-xs mt-1">1 vs 1</span>
          </div>
        </Link>
      </div>

      <GameSetup isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}/>
    </div>
  );
};

export default Games;
