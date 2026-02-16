"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AvatarOption = {
  color: string;
  alt: string;
};

type GameData = {
  player1NickName: string;
  player1Avatar: string;
  player2NickName: string;
  player2Avatar: string;

  paddleColor: string;
  ballColor: string;
  boardColor: string;
  scoreLimit: number;
  paddleSize: number;

  player1Score: number;
  player2Score: number;
};

type GameSetupProps = {
  isVisible: boolean;
  onClose: () => void;
};

const EMPTY_AVATAR = "/gameAvatars/Empty.jpeg";

const DEFAULT_GAME_DATA: GameData = {
  player1NickName: "",
  player1Avatar: EMPTY_AVATAR,
  player2NickName: "",
  player2Avatar: EMPTY_AVATAR,

  paddleColor: "#D9D9D9",
  ballColor: "#D9D9D9",
  boardColor: "#262626",
  scoreLimit: 5,
  paddleSize: 1,

  player1Score: 0,
  player2Score: 0,
};

const AVATARS: AvatarOption[] = [
  { color: "/gameAvatars/profile1.jpeg", alt: "avatar 1" },
  { color: "/gameAvatars/profile2.jpeg", alt: "avatar 2" },
  { color: "/gameAvatars/profile3.jpeg", alt: "avatar 3" },
  { color: "/gameAvatars/profile4.jpeg", alt: "avatar 4" },
  { color: "/gameAvatars/profile5.jpeg", alt: "avatar 5" },
  { color: "/gameAvatars/profile6.jpeg", alt: "avatar 6" },
];

function normalizeNickname(raw: string) {
  return raw.replace(/^@+/, "").trim();
}

function isPlayerReady(nick: string, avatar: string) {
  return normalizeNickname(nick).length > 0 && avatar !== EMPTY_AVATAR;
}

export default function GameSetup({ isVisible, onClose }: GameSetupProps) {
  const router = useRouter();

  const [gameData, setGameData] = useState<GameData>(DEFAULT_GAME_DATA);

  useEffect(() => {
    localStorage.setItem("GameData", JSON.stringify(gameData));
  }, [gameData]);

  const isReadyToPlay = useMemo(() => {
    return (
      isPlayerReady(gameData.player1NickName, gameData.player1Avatar) &&
      isPlayerReady(gameData.player2NickName, gameData.player2Avatar)
    );
  }, [gameData.player1NickName, gameData.player1Avatar, gameData.player2NickName, gameData.player2Avatar]);

  const setPlayerAvatar = useCallback((player: 1 | 2, avatar: string) => {
    setGameData((prev) =>
      player === 1 ? { ...prev, player1Avatar: avatar } : { ...prev, player2Avatar: avatar }
    );
  }, []);

  const setPlayerNickname = useCallback((player: 1 | 2, value: string) => {
    const cleaned = normalizeNickname(value);
    setGameData((prev) =>
      player === 1 ? { ...prev, player1NickName: cleaned } : { ...prev, player2NickName: cleaned }
    );
  }, []);

  const handlePlay = useCallback(() => {
    if (!isReadyToPlay) return;
    localStorage.setItem("GameData", JSON.stringify(gameData));
    router.push("/game/local");
  }, [gameData, isReadyToPlay, router]);

  if (!isVisible) return null;

  const avatarThumbButtonClass =
    "group relative h-11 w-11 overflow-hidden rounded-lg transition-transform hover:scale-110 focus:outline-none";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative bg-[#1A1A1A]/75 backdrop-blur-md p-6 rounded-3xl shadow-lg w-full max-w-4xl m-3">
        
				<div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Game Setup</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition"
            type="button"
          >
            Close
          </button>
        </div>


        <div className="grid md:grid-cols-2 gap-6">

          <div className="flex flex-col items-center border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player 1</h2>

            <Image
							width={200}
							height={200}
              src={gameData.player1Avatar}
              alt="Player 1 avatar"
              className="w-20 h-20 rounded-lg object-cover shadow mb-2"
            />

            <p className="text-gray-400 mb-4">
              @{normalizeNickname(gameData.player1NickName) || "nickname"}
            </p>

            <label className="text-white mb-2 self-start">Choose your avatar:</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {AVATARS.map((a) => {
                const isSelected = gameData.player1Avatar === a.color;
                return (
                  <button
                    key={a.color}
                    type="button"
                    onClick={() => setPlayerAvatar(1, a.color)}
                    className={avatarThumbButtonClass}
                    aria-label={`Select ${a.alt} for player 1`}
                  >
                    <Image
										width={200}
										height={200}
                      src={a.color}
                      alt={a.alt}
                      className={
                        isSelected
                          ? "h-full w-full rounded-lg object-cover transition-all"
                          : "h-full w-full rounded-lg object-cover grayscale transition-all duration-200 group-hover:grayscale-0"
                      }
                    />
                    {!isSelected ? (
                      <span className="pointer-events-none absolute inset-0 bg-black/45 transition-opacity duration-200 group-hover:opacity-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <label htmlFor="nickname1" className="text-white mb-2 self-start">
              Nickname
            </label>
            <input
              id="nickname1"
              type="text"
              placeholder="Enter your @nickname"
              className="p-2 rounded-lg bg-[#848484]/30 text-white placeholder-gray-400 text-sm w-full"
              value={gameData.player1NickName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPlayerNickname(1, e.target.value)
              }
            />
          </div>


          <div className="flex flex-col items-center border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player 2</h2>

            <Image
							width={200}
							height={200}
              src={gameData.player2Avatar}
              alt="Player 2 avatar"
              className="w-20 h-20 rounded-lg object-cover shadow mb-2"
            />

            <p className="text-gray-400 mb-4">
              @{normalizeNickname(gameData.player2NickName) || "nickname"}
            </p>

            <label className="text-white mb-2 self-start">Choose your avatar:</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {AVATARS.map((a) => {
                const isSelected = gameData.player2Avatar === a.color;
                return (
                  <button
                    key={a.color}
                    type="button"
                    onClick={() => setPlayerAvatar(2, a.color)}
                    className={avatarThumbButtonClass}
                    aria-label={`Select ${a.alt} for player 2`}
                  >
                    <Image
										width={200}
										height={200}
                      src={a.color}
                      alt={a.alt}
                      className={
                        isSelected
                          ? "h-full w-full rounded-lg object-cover transition-all"
                          : "h-full w-full rounded-lg object-cover grayscale transition-all duration-200 group-hover:grayscale-0"
                      }
                    />
                    {!isSelected ? (
                      <span className="pointer-events-none absolute inset-0 bg-black/45 transition-opacity duration-200 group-hover:opacity-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <label htmlFor="nickname2" className="text-white mb-2 self-start">
              Nickname
            </label>
            <input
              id="nickname2"
              type="text"
              placeholder="Enter your @nickname"
              className="p-2 rounded-lg bg-[#848484]/30 text-white placeholder-gray-400 text-sm w-full"
              value={gameData.player2NickName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPlayerNickname(2, e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            disabled={!isReadyToPlay}
            onClick={handlePlay}
            className="text-gray-400 hover:text-white bg-[#848484]/20 hover:bg-[#848484]/30 rounded-md px-6 py-2 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          >
            Start Game
          </button>
        </div>

      </div>
    </div>
  );
}
