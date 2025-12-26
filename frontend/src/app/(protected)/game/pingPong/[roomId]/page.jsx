"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  autoConnect: false,
});

const GAME_WIDTH = 1024;
const GAME_HEIGHT = 700;

export default function Page() {
  const { user } = useAuth();

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const bgRef = useRef(null);
  const lastMoveRef = useRef(0);

  const [game, setGame] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!user) return;
    if (!socket.connected) socket.connect();
    socket.emit("update-data", {
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      avatar: user.avatar,
    });
  }, [user]);

  useEffect(() => {
    socket.on("match-data", setGame);
    socket.on("game-state", setGame);
    return () => {
      socket.off("match-data");
      socket.off("game-state");
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/BGs/BG1.jpeg";
    img.onload = () => (bgRef.current = img);
  }, []);

  useEffect(() => {
    const resize = () => {
      if (!wrapperRef.current) return;
      const availableWidth = wrapperRef.current.clientWidth;
      setScale(Math.min(availableWidth / GAME_WIDTH, 1));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const keyDownHandler = (e) => {
      const now = Date.now();
      if (now - lastMoveRef.current < 40) return;
      lastMoveRef.current = now;

      if (e.key === "w" || e.key === "ArrowUp")
        socket.emit("paddle-move", { direction: "up" });

      if (e.key === "s" || e.key === "ArrowDown")
        socket.emit("paddle-move", { direction: "down" });
    };

    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  }, []);

  useEffect(() => {
    if (!game) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    const render = () => {
      context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      context.beginPath();
      context.setLineDash([15, 8]);
      context.moveTo(GAME_WIDTH / 2, 0);
      context.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      context.strokeStyle = "#FFFFFF";
      context.stroke();

      context.fillStyle = "white";
      context.beginPath();
      context.arc(
        game.ball.x,
        game.ball.y,
        game.ball.radius,
        0,
        Math.PI * 2
      );
      context.fill();

      drawPaddle(context, game.player1.player);
      drawPaddle(context, game.player2.player);

      // requestAnimationFrame(render);
    };

    render();
  }, [game]);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {game && (
        <div className="flex justify-between w-full max-w-5xl px-4 mt-6 mb-5">
          <PlayerCard player={game.player1} />
          <p className="text-4xl font-bold">
            {game.player1.score} - {game.player2.score}
          </p>
          <PlayerCard player={game.player2} />
        </div>
      )}

      <div ref={wrapperRef} className="w-full max-w-5xl flex justify-center">
        <canvas
          ref={canvasRef}
          style={{
            width: GAME_WIDTH * scale,
            height: GAME_HEIGHT * scale,
          }}
          className="rounded-2xl border border-white/60"
        />
      </div>
    </div>
  );
}

function drawPaddle(context, paddle) {
  context.fillStyle = "white";
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function PlayerCard({ player }) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={player.avatar}
        className="w-14 h-14 rounded-lg object-cover"
      />
      <p className="font-semibold">
        {player.firstName}.{player.lastName?.[0]}
      </p>
      <span className="text-sm text-gray-400">
        [@{player.username}]
      </span>
    </div>
  );
}
