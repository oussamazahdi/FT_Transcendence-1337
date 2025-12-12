"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

const GameSetup = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const avatarStyle =
    "w-11 h-11 rounded-lg object-cover cursor-pointer transition-all hover:scale-110";

  const [selectedAvatar1, setSelectedAvatar1] = useState(null);
  const [nickname1, setNickname1] = useState("");
  const [selectedAvatar2, setSelectedAvatar2] = useState(null);
  const [nickname2, setNickname2] = useState("");

  const [gameData, setGameData] = useState({
    player1NickName: "player 1",
    player1Avatar: "/gameAvatars/Empty.jpeg",
    player2NickName: "player 2",
    player2Avatar: "/gameAvatars/Empty.jpeg",
    paddleColor: "#D9D9D9",
    ballColor: "#D9D9D9",
    boardColor: "#262626",
    scoreLimit: 5,
    ballSpeed: 1,
    paddleSize: 1,
    player1Score: 0,
    player2Score: 0,
  });

  useEffect(() => {
    localStorage.setItem("GameData", JSON.stringify(gameData));
  }, [gameData]);

  const avatars = [
    {
      color: "/gameAvatars/profile1.jpeg",
      black: "/gameAvatars/blackAvatar/avatar1.png",
      alt: "avatar 1",
    },
    {
      color: "/gameAvatars/profile2.jpeg",
      black: "/gameAvatars/blackAvatar/avatar2.png",
      alt: "avatar 2",
    },
    {
      color: "/gameAvatars/profile3.jpeg",
      black: "/gameAvatars/blackAvatar/avatar3.png",
      alt: "avatar 3",
    },
    {
      color: "/gameAvatars/profile4.jpeg",
      black: "/gameAvatars/blackAvatar/avatar4.png",
      alt: "avatar 4",
    },
    {
      color: "/gameAvatars/profile5.jpeg",
      black: "/gameAvatars/blackAvatar/avatar5.png",
      alt: "avatar 5",
    },
    {
      color: "/gameAvatars/profile6.jpeg",
      black: "/gameAvatars/blackAvatar/avatar6.png",
      alt: "avatar 6",
    },
  ];

  const colorList = [
    { name: "black", class: "bg-[#262626]", hashCode: "#262626" },
    { name: "gray", class: "bg-[#5F5F5F]", hashCode: "#5F5F5F" },
    { name: "white", class: "bg-[#D9D9D9]", hashCode: "#D9D9D9" },
    { name: "blue", class: "bg-[#294BAE]", hashCode: "#294BAE" },
    { name: "purple", class: "bg-[#7D29AE]", hashCode: "#7D29AE" },
    { name: "orange", class: "bg-[#E9932B]", hashCode: "#E9932B" },
  ];

  const player1 = { nickname: "@nickname", avatar: "/gameAvatars/Empty.jpeg" };
  const player2 = { nickname: "@nickname", avatar: "/gameAvatars/Empty.jpeg" };

  const [wizardForm, setWizardForm] = useState(1);

  const firstWizardStep = () => {
    return (
      <div className="relative bg-[#1A1A1A]/75 backdrop-blur-md p-6 rounded-3xl shadow-lg w-full max-w-4xl m-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Game Setup</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition"
          >
            Close
          </button>
        </div>

        {/* Players */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Player 1 */}
          <div className="flex flex-col items-center border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player 1</h2>
            <img
              src={selectedAvatar1 || player1.avatar}
              alt="Player 1 avatar"
              className="w-20 h-20 rounded-lg object-cover shadow mb-2"
            />
            <p className="text-gray-400 mb-4">@{nickname1 || "nickname"}</p>

            <label className="text-white mb-2 self-start">
              Choose your avatar:
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {avatars.map((a) => (
                <img
                  key={a.color}
                  src={selectedAvatar1 === a.color ? a.color : a.black}
                  alt={a.alt}
                  className={avatarStyle}
                  onClick={() => {
                    setSelectedAvatar1(a.color);
                    setGameData((prev) => ({
                      ...prev,
                      player1Avatar: a.color,
                    }));
                  }}
                />
              ))}
            </div>

            <label htmlFor="nickname1" className="text-white mb-2 self-start">
              Nickname
            </label>
            <input
              id="nickname1"
              type="text"
              placeholder="Enter your @nickname"
              className="p-2 rounded-lg bg-[#848484]/30 text-white placeholder-gray-400 text-sm w-full"
              value={nickname1}
              onChange={(e) => {
                setNickname1(e.target.value);
                setGameData((prev) => ({
                  ...prev,
                  player1NickName: e.target.value,
                }));
              }}
            />
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player 2</h2>
            <img
              src={selectedAvatar2 || player2.avatar}
              alt="Player 2 avatar"
              className="w-20 h-20 rounded-lg object-cover shadow mb-2"
            />
            <p className="text-gray-400 mb-4">@{nickname2 || "nickname"}</p>

            <label className="text-white mb-2 self-start">
              Choose your avatar:
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {avatars.map((a) => (
                <img
                  key={a.color}
                  src={selectedAvatar2 === a.color ? a.color : a.black}
                  alt={a.alt}
                  className={avatarStyle}
                  onClick={() => {
                    setSelectedAvatar2(a.color);
                    setGameData((prev) => ({
                      ...prev,
                      player2Avatar: a.color,
                    }));
                  }}
                />
              ))}
            </div>

            <label htmlFor="nickname2" className="text-white mb-2 self-start">
              Nickname
            </label>
            <input
              id="nickname2"
              type="text"
              placeholder="Enter your @nickname"
              className="p-2 rounded-lg bg-[#848484]/30 text-white placeholder-gray-400 text-sm w-full"
              value={nickname2}
              onChange={(e) => {
                setNickname2(e.target.value);
                setGameData((prev) => ({
                  ...prev,
                  player2NickName: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between mt-6">
          <button className="text-gray-400">Prev</button>
          <button
            className="text-gray-400 hover:text-white hover:bg-[#848484]/30 rounded-full px-4 py-1 transition"
            onClick={() => {
              setWizardForm(2);
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const secondWizardStep = () => {
    return (
      <div className="relative bg-[#1A1A1A]/75 backdrop-blur-md p-6 rounded-3xl shadow-lg w-full max-w-4xl m-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Game Settings</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition"
          >
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="self-start border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Visual Customization
            </h2>
            <div className="mb-1">
              <h3>Paddle Color</h3>
              <div className="space-x-3">
                {colorList.map((c) => (
                  <button
                    key={c.name}
                    className={`w-10 h-10 ${c.class} rounded-md border ${gameData.paddleColor === c.hashCode ? "border-white scale-110" : "border-gray-400/0"} hover:scale-110 transition-transform`}
                    onClick={() =>
                      setGameData((prev) => ({
                        ...prev,
                        paddleColor: c.hashCode,
                      }))
                    }
                  />
                ))}
              </div>
              <h4 className="text-sm text-gray-400/65">
                Choose your paddle color{" "}
              </h4>
            </div>

            <div className="mb-1">
              <h3>Ball Color</h3>
              <div className="space-x-3">
                {colorList.map((c) => (
                  <button
                    key={c.name}
                    className={`w-10 h-10 ${c.class} rounded-md border  ${gameData.ballColor === c.hashCode ? "border-white scale-110" : "border-gray-400/0"} hover:scale-110 transition-transform`}
                    onClick={() =>
                      setGameData((prev) => ({
                        ...prev,
                        ballColor: c.hashCode,
                      }))
                    }
                  />
                ))}
              </div>
              <h4 className="text-sm text-gray-400/65">
                Choose your ball color{" "}
              </h4>
            </div>

            <div className="mb-3">
              <h3>Board Color</h3>
              <div className="space-x-3">
                {colorList.map((c) => (
                  <button
                    key={c.name}
                    className={`w-10 h-10 ${c.class} rounded-md border ${gameData.boardColor === c.hashCode ? "border-white scale-110" : "border-gray-400/0"} hover:scale-110 transition-transform`}
                    onClick={() =>
                      setGameData((prev) => ({
                        ...prev,
                        boardColor: c.hashCode,
                      }))
                    }
                  />
                ))}
              </div>
              <h4 className="text-sm text-gray-400/65">
                Choose your Board color{" "}
              </h4>
            </div>
          </div>

          <div className="self-start border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Game Configuration
            </h2>

            <div className="mb-8">
              <Slider
                className="max-w-md"
                color="foreground"
                defaultValue={5}
                label="Score Limit"
                maxValue={15}
                minValue={5}
                showSteps={true}
                size="md"
                step={1}
                onChange={(value) =>
                  setGameData((prev) => ({ ...prev, scoreLimit: value }))
                }
              />
              <h4 className="text-sm text-gray-400/65 pt-1">
                First player to reach this score wins
              </h4>
            </div>

            <div className="mb-8">
              <Slider
                className="max-w-md"
                color="foreground"
                defaultValue={1}
                label="Ball Speed"
                maxValue={3}
                minValue={1}
                showSteps={true}
                size="md"
                step={1}
                onChange={(value) =>
                  setGameData((prev) => ({ ...prev, ballSpeed: value }))
                }
              />
              <h4 className="text-sm text-gray-400/65 pt-1">
                Adjust the speed of the ball
              </h4>
            </div>

            <div className="mb-9">
              <Slider
                className="max-w-md"
                color="foreground"
                defaultValue={1}
                label="Paddle Size"
                maxValue={4}
                minValue={1}
                showSteps={true}
                size="md"
                step={1}
                onChange={(value) =>
                  setGameData((prev) => ({ ...prev, paddleSize: value }))
                }
              />
              <h4 className="text-sm text-gray-400/65 pt-1">
                Change the height of the paddles
              </h4>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="text-gray-400 hover:text-white hover:bg-[#848484]/30 rounded-full px-4 py-1 transition"
            onClick={() => setWizardForm(1)}
          >
            Prev
          </button>
          <Link href="/game/pingPong/local-game">
            <button className="text-gray-400 hover:text-white hover:bg-[#848484]/30 rounded-full px-4 py-1 transition">
              Play
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {wizardForm === 1 ? firstWizardStep() : secondWizardStep()}
    </div>
  );
};

export default GameSetup;
