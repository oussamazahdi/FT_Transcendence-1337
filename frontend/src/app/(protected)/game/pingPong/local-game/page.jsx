"use client";

import React, { useRef, useState, useEffect } from "react";

export default function PingPongGame() {
  const paddleSpeed = 4;
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const isPauseRef = useRef(false);

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
    if (!dataLine) return;
    const data = JSON.parse(dataLine);
    const paddleHeight = 90 + 15 * data.paddleSize;
    const width = 1024;
    const height = 700;
    // const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4
    // const direction = Math.random() > 0.5 ? 1 : -1
    // state.ball.dx = Math.cos(angle) * settings.ballSpeed * direction
    // state.ball.dy = Math.sin(angle) * settings.ballSpeed

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
    // console.log("game data=>", data);
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

    const keyDownHandler = (e) => {
      if (e.key === "w") state.keys.w = true;
      if (e.key === "s") state.keys.s = true;
      if (e.key === "ArrowUp") state.keys.ArrowUp = true;
      if (e.key === "ArrowDown") state.keys.ArrowDown = true;
      if (e.key === " ") togglePause(); // spacebar toggles pause too
    };

    const keyUpHandler = (e) => {
      if (e.key === "w") state.keys.w = false;
      if (e.key === "s") state.keys.s = false;
      if (e.key === "ArrowUp") state.keys.ArrowUp = false;
      if (e.key === "ArrowDown") state.keys.ArrowDown = false;
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    const gameLoop = () => {
      if (isPauseRef.current || gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Movement
      if (state.keys.w && state.player1.y > 0) state.player1.y -= paddleSpeed;
      if (
        state.keys.s &&
        state.player1.y + state.player1.height < state.board.height
      )
        state.player1.y += paddleSpeed;
      if (state.keys.ArrowUp && state.player2.y > 0)
        state.player2.y -= paddleSpeed;
      if (
        state.keys.ArrowDown &&
        state.player2.y + state.player2.height < state.board.height
      )
        state.player2.y += paddleSpeed;

      // Clear board
      context.clearRect(0, 0, state.board.width, state.board.height);

      // Ball collisions
      if (
        state.ball.y - state.ball.radius <= 0 ||
        state.ball.y + state.ball.radius >= state.board.height
      )
        state.ball.velocityY *= -1;

      if (
        state.ball.x + state.ball.radius > state.player2.x &&
        state.ball.y > state.player2.y &&
        state.ball.y < state.player2.y + state.player2.height
      ) {
        state.ball.velocityX *= -1;
        state.ball.velocityY =
          (state.ball.y - state.player2.y) / state.player2.height - 0.5;
        // console.log("ball x: ", state.ball.x, " ball y: ", state.ball.y, " player 2 x : ", state.player2.x ," player 2 y : ", state.player2.y)
      }
      if (
        state.ball.x - state.ball.radius <
          state.player1.x + state.player1.width &&
        state.ball.y - state.ball.radius > state.player1.y &&
        state.ball.y + state.ball.radius <
          state.player1.y + state.player1.height
      ) {
        state.ball.velocityX *= -1;
        state.ball.velocityY =
          ((state.ball.y - state.player1.y) / state.player1.height - 0.5) *
          state.ball.speed *
          2;
      }

      // Scoring
      if (state.ball.x <= 0 || state.ball.x >= state.board.width) {
        if (state.ball.x >= state.board.width) setScore1((s) => s + 1);
        if (state.ball.x <= 0) setScore2((s) => s + 1);
        state.ball.x = state.board.width / 2;
        state.ball.y = state.board.height / 2;
      }

      // Ball movement
      state.ball.x += state.ball.velocityX * state.ball.speed;
      state.ball.y += state.ball.velocityY * state.ball.speed;

      // Draw
      context.beginPath();
      context.setLineDash([15, 8]);
      context.moveTo(state.board.width / 2, 0);
      context.lineTo(state.board.width / 2, state.board.height);
      context.strokeStyle = "#FFFFFF";
      context.stroke();

      context.fillStyle = players.player1.color;
      context.fillRect(
        state.player1.x,
        state.player1.y,
        state.player1.width,
        state.player1.height,
      );
      context.fillRect(
        state.player2.x,
        state.player2.y,
        state.player2.width,
        state.player2.height,
      );

      context.beginPath();
      context.arc(
        state.ball.x,
        state.ball.y,
        state.ball.radius,
        0,
        Math.PI * 2,
      );
      context.fillStyle = players.ballColor;
      context.fill();
      // console.log("ball color : ", players.ballColor, " paddle color : ", players.player1.color)

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
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
