"use client";

import React, { useRef, useState, useEffect } from "react";
import { GameUtiles } from "./lib/utils";
import {GAME_MODE, GAME_WIDTH, GAME_HEIGHT} from "@/components/ui/GameMode"
import { useAuth } from "@/contexts/authContext";

export default function PingPongGame() {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const isPauseRef = useRef(false);

	const printRef = useRef(false);

  const [players, setPlayers] = useState({
    player1: {
      nickName: "Player 1",
      avatar: "/gameAvatars/Empty.jpeg",
      color: "bg-gray-300",
    },
    player2: {
      nickName: "Player 2",
      avatar: "/gameAvatars/Empty.jpeg",
      color: "#D9D9D9",
    },
    boardColor: "#262626",
    ballColor: "#D9D9D9",
  });

  const gameStateRef = useRef({
    board: { width: 1024, height: 700, color: "#262626" },
    ball: { x: 512, y: 350, velocityX: 5, velocityY: 5, speed: 5, radius: 10 },
    player1: { x: 30, y: 300, width: 20, height: 100 },
    player2: { x: 974, y: 300, width: 20, height: 100 },
    keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
    scoreLimit: 5,
  });

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const dataLine = localStorage.getItem("GameData");
		if(!printRef.current){
			console.log("----> Local Storage :", dataLine);
			printRef.current = true;
		}
    if (!dataLine) return;
    const data = JSON.parse(dataLine);
    const paddleHeight = 90 + 15 * data.paddleSize;
    const width = 1024;
    const height = 700;

    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    const direction = Math.random() > 0.5 ? 1 : -1;

    gameStateRef.current = {
      board: { width, height, color: data.boardColor },
      ball: {
        x: width / 2,
        y: height / 2,
        velocityX: Math.cos(angle) * data.ballSpeed * direction,
        velocityY: Math.sin(angle) * data.ballSpeed,
        speed: data.ballSpeed > 2 ? 0.6 * data.ballSpeed : 0.5 * data.ballSpeed,
        radius: 10,
      },
      player1: {
        x: 40,
        y: height / 2 - paddleHeight / 2,
        width: 15,
        height: paddleHeight,
      },
      player2: {
        x: width - 60,
        y: height / 2 - paddleHeight / 2,
        width: 15,
        height: paddleHeight,
      },
      keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
      scoreLimit: data.scoreLimit,
    };
    setPlayers({
      player1: {
        nickName: data.player1NickName,
        avatar: data.player1Avatar,
        color: data.paddleColor,
      },
      player2: {
        nickName: data.player2NickName,
        avatar: data.player2Avatar,
        color: data.paddleColor,
      },
      boardColor: data.boardColor,
      ballColor: data.ballColor,
    });

    setScore1(data.player1Score || 0);
    setScore2(data.player2Score || 0);
  }, []);

  useEffect(() => {
    const state = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

		const { onKeyDown, onKeyUp } = GameUtiles.createKeyboardHandlers({
			stateRef: gameStateRef,
			togglePause,
		});

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);

    const gameLoop = () => {
      if (isPauseRef.current || gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      context.clearRect(0, 0, state.board.width, state.board.height);
			
			GameUtiles.paddleMovement(state);
			GameUtiles.ballCollisions(state);
			GameUtiles.handleScoring(state, setScore1, setScore2);
			GameUtiles.ballMovement(state);
			GameUtiles.drawLocalFrame(context, state, players);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameOver, players]);

  const togglePause = () => {
    setIsPause((prev) => {
      const newValue = !prev;
      isPauseRef.current = newValue;
      return newValue;
    });
  };

  return (
    <div className="trelative inset-x-0 flex flex-col items-center text-white space-y-6">
      <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
        <div className="flex gap-1 flex-col items-center">
          <img
            src={players.player1.avatar}
            alt="player 1 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-2xl font-semibold">{players.player1.nickName}</h3>
          <p className="text-xs text-[#858585]">w (up) / s (down)</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold">{`${score1} - ${score2}`}</p>
        </div>

        <div className="flex gap-1 flex-col items-center">
          <img
            src={players.player2.avatar}
            alt="player 2 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-2xl font-semibold">{players.player2.nickName}</h3>
          <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
        </div>
      </div>

      <div className="mx-4">
        <canvas
          ref={canvasRef}
          width={gameStateRef.current.board.width}
          height={gameStateRef.current.board.height}
          className={`bg-[${players.boardColor}] w-full max-w-240 rounded-2xl border border-white/20`}
        />
      </div>

      <div className="flex flex-row gap-6 mb-4">
        <button
          className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition"
          onClick={togglePause}
        >
          {isPause ? "Resume" : "Pause"}
        </button>
        <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">
          Restart
        </button>
      </div>
    </div>
  );
}

