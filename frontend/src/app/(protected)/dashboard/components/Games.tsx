import React from "react";
import Image from "next/image";
import { assets } from "@/assets/data";

const Games = () => {
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] p-2 flex flex-col h-full min-h-[180px] md:min-h-0">
      {/* container that defines the height */}
      <div className="flex flex-col md:flex-row gap-2 w-full flex-1 min-h-0">
        
        {/* Card */}
        <div className="relative flex-1 min-h-[120px] md:min-h-0 rounded-xl overflow-hidden group cursor-pointer">
          <Image
            src={assets.pingPongL}
            alt="Local Game"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute bottom-0 w-full h-24 bg-linear-to-t from-black via-black/80 to-transparent" />

          <p className="absolute bottom-2 w-full text-center text-sm font-bold z-10 text-white">
            Local Game
            <br />
            <span className="text-gray-400 text-xs font-normal">1 vs 1</span>
          </p>
        </div>

        {/* Card */}
        <div className="relative flex-1 min-h-[120px] md:min-h-0 rounded-xl overflow-hidden group cursor-pointer">
          <Image
            src={assets.pingPongR}
            alt="Remote Game"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute bottom-0 w-full h-24 bg-linear-to-t from-black via-black/80 to-transparent" />

          <p className="absolute bottom-2 w-full text-center text-sm font-bold z-10 text-white">
            Remote Game
            <br />
            <span className="text-gray-400 text-xs font-normal">1 vs 1</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Games;
