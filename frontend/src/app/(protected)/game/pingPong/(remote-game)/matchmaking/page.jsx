"use client";

import React, { useState } from "react";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import Link from "next/link";

export default function Matchmaking() {
  const [timer, setTimer] = useState(true);
  return (
    <div className="flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl">
      <h3 className="text-3xl font-extrabold mb-6">Find Match</h3>

      <div className="flex items-center justify-between gap-x-25">
        <div className="flex flex-col items-center">
          <img
            src="/gameAvatars/profile5.jpeg"
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />
          <h3 className="text-xl font-semibold">Oussama.Z</h3>
          <h3 className="text-md font-medium text-[#6E6E6E]">[ozahdi]</h3>
        </div>

        <span className="text-3xl font-extrabold">VS</span>

        <div className="flex flex-col items-center">
          <img
            src="/gameAvatars/Empty.jpeg"
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />
          <h3 className="text-xl font-semibold">Player 2</h3>
          <h3 className="text-md font-medium text-[#6E6E6E]">[player2]</h3>
        </div>
      </div>
      {timer == true ? (
        <CountdownTimer
          totalMinutes={0}
          totalSeconds={5}
          startColor="#D9D9D9"
          endColor="#D9D9D9"
          size="md"
          onFinish={() => setTimer(false)}
        />
      ) : (
        <div className="flex gap-3 mt-5">
          <Link href={"/game/pingPong"}>
            <button className="bg-[#0F0F0F]/65 text-white/40 hover:text-white px-3 py-2 rounded-md font-medium transition duration-300 cursor-pointer">
              Exit
            </button>
          </Link>
          <button
            onClick={() => setTimer(true)}
            className="bg-[#0F0F0F]/65 text-white/40 hover:text-white px-3 py-2 rounded-md font-medium transition duration-300 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </div>
    // </div>
  );
}
