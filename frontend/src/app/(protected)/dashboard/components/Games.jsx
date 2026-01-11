import React from "react";
import Image from "next/image";
import { assets } from "@/assets/data";

const Games = () => {
  return (
    <div className="bg-[#0F0F0F]/75 rounded-[20px] basis-4/10 p-4">
      <p className="font-bold text-lg">Games</p>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-row gap-4">
          <div className="relative">
            <Image
              src={assets.pingPongL}
              width={140}
              height={140}
              alt="icon"
              className="rounded-xl"
            />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#000000] to-[#000000]/0 rounded-b-xl"></div>
            <p className="absolute bottom-0 w-full text-center text-sm font-bold pb-2 z-10">
              Local Game
              <br />1 vs 1
            </p>
          </div>
          <div className="relative">
            <Image
              src={assets.pingPongR}
              width={140}
              height={140}
              alt="icon"
              className="rounded-xl"
            />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#000000] to-[#000000]/0 rounded-b-xl"></div>
            <p className="absolute bottom-0 w-full text-center text-sm font-bold pb-2 z-10">
              Remote Game
              <br />1 vs 1
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="relative">
            <Image
              src={assets.ticTactoeL}
              width={140}
              height={140}
              alt="icon"
              className="rounded-xl"
            />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#000000] to-[#000000]/0 rounded-b-xl"></div>
            <p className="absolute bottom-0 w-full text-center text-sm font-bold pb-2 z-10">
              Local Game
              <br />1 vs 1
            </p>
          </div>
          <div className="relative">
            <Image
              src={assets.ticTactoeR}
              width={140}
              height={140}
              alt="icon"
              className="rounded-xl"
            />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#000000] to-[#000000]/0 rounded-b-xl"></div>
            <p className="absolute bottom-0 w-full text-center text-sm font-bold pb-2 z-10">
              Remote Game
              <br />1 vs 1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
