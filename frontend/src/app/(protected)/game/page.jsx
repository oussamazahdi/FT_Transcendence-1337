"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Game() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const localGameItems = [
    {
      titel: "Ping Pong",
      cover: "/Game/PingPongCover.png",
      alt: "1vs1 cover",
      description:
        "Play a Ping Pong game with your friends locally or remotely",
      button: "Start Game",
    },
    {
      titel: "Tic Tac Toe",
      cover: "/Game/XOCover.png",
      alt: "XO game cover",
      description:
        "Play a Tic Tac Toe game with your friends locally or remotely.",
      button: "Start Game",
    },
  ];

  const LocalGame = () => {
    return (
      <div className="flex items-center grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl">
        <div className="rounded-3xl bg-[#0F0F0F]/60 px-3 pt-3 text-center m-3">
          <img
            src={localGameItems[0].cover}
            alt={localGameItems[0].alt}
            className="w-full h-110 object-cover rounded-xl "
          />
          <h1 className="font-bold text-2xl pt-3 pb-1">
            {localGameItems[0].titel}
          </h1>
          <p className="pb-3 text-[#D5D5D5]/60">
            {localGameItems[0].description}
          </p>
          <Link href="/game/pingPong">
            <button
              className=" bg-[#333333]/60 hover:bg-[#333333]/40 mb-3 py-2 w-full rounded-lg \
            cursor-pointer shadow-md font-medium"
              onClick={() => setIsModalVisible(true)}
            >
              {localGameItems[0].button}
            </button>
          </Link>
        </div>
        <div className="rounded-3xl bg-[#0F0F0F]/60 px-3 pt-3 text-center m-3">
          <img
            src={localGameItems[1].cover}
            alt={localGameItems[1].alt}
            className="w-full h-110 object-cover rounded-xl"
          />
          <h1 className="font-bold text-2xl pt-3 pb-1">
            {localGameItems[1].titel}
          </h1>
          <p className="pb-3 text-[#D5D5D5]/60">
            {localGameItems[1].description}
          </p>
          <Link href="/game">
            <button className=" bg-[#333333]/60 hover:bg-[#333333]/40 mb-3 py-2 w-full rounded-lg cursor-pointer shadow-md font-medium">
              {localGameItems[1].button}
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="relative text-white flex flex-col inset-x-0  items-center">
      <LocalGame />
    </div>
  );
}