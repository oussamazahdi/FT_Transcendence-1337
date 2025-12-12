"use client";

import React, { useState } from "react";
import GameSetup from "@/components/gameSetupComp/gameSetup";
import { useRouter } from "next/navigation";

const LocalGame = () => {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const localGameItems = [
    {
      titel: "Local Game",
      cover: "/Game/pingpong/local.png",
      alt: "1vs1 cover",
      description: "Play a single game against a friend.",
      button: "Start Game",
    },
    {
      titel: "Tournament",
      cover: "/Game/pingpong/Tour.png",
      alt: "Tounament cover",
      description: "Create your own tournament.",
      button: "Create Tournament",
    },
    {
      titel: "Remote Game",
      cover: "/Game/pingpong/remote.png",
      alt: "Remote Game cover",
      description: "Play a single game against a friend.",
      button: "Start Game",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-6">
      <div
        key={localGameItems[0].titel}
        className="rounded-3xl bg-[#0F0F0F]/65 my-3 px-3 pt-3 text-center"
      >
        <img
          src={localGameItems[0].cover}
          alt={localGameItems[0].alt}
          className="w-full h-110 object-cover rounded-xl"
        />
        <h1 className="font-bold text-2xl pt-3 pb-1">
          {localGameItems[0].titel}
        </h1>
        <p className="pb-3 text-[#D5D5D5]">{localGameItems[0].description}</p>
        <button
          className=" bg-[#333333]/60 hover:bg-[#333333]/40 mb-3 py-2 w-full rounded-lg \
				cursor-pointer shadow-md font-medium"
          onClick={() => setIsModalVisible(true)}
        >
          {localGameItems[0].button}
        </button>
      </div>

      <div
        key={localGameItems[1].titel}
        className="rounded-3xl bg-[#0F0F0F]/65 my-3 px-3 pt-3 text-center"
      >
        <img
          src={localGameItems[1].cover}
          alt={localGameItems[1].alt}
          className="w-full h-110 object-cover rounded-xl"
        />
        <h1 className="font-bold text-2xl pt-3 pb-1">
          {localGameItems[1].titel}
        </h1>
        <p className="pb-3 text-[#D5D5D5]">{localGameItems[1].description}</p>
        <button
          className=" bg-[#333333]/60 hover:bg-[#333333]/40 mb-3 py-2 w-full rounded-lg cursor-pointer shadow-md font-medium"
          onClick={() => router.push("/game/pingPong/tournament")}
        >
          {localGameItems[1].button}
        </button>
      </div>

      <div
        key={localGameItems[2].titel}
        className="rounded-3xl bg-[#0F0F0F]/65 my-3 px-3 pt-3 text-center"
      >
        <img
          src={localGameItems[2].cover}
          alt={localGameItems[2].alt}
          className="w-full h-110 object-cover rounded-xl"
        />
        <h1 className="font-bold text-2xl pt-3 pb-1">
          {localGameItems[2].titel}
        </h1>
        <p className="pb-3 text-[#D5D5D5]">{localGameItems[2].description}</p>
        <button
          className=" bg-[#333333]/60 hover:bg-[#333333]/40 mb-3 py-2 w-full rounded-lg \
				cursor-pointer shadow-md font-medium"
          onClick={() => router.push("/game/pingPong/matchmaking")}
        >
          {localGameItems[2].button}
        </button>
      </div>

      <GameSetup
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default LocalGame;
