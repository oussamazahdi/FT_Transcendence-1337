"use client";

import {GAME_MODE, GAME_WIDTH, GAME_HEIGHT} from "@/components/ui/GameMode"
import { useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";
import { GameResult } from "./components/GameResult";
import { ScoreBoard } from "./components/PlayerCard";
import { drawFrame, preloadBackground  } from "./lib/utils";

export default function GamePage() {
  const socket = useSocket();
  const { user, gameSetting } = useAuth();

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [game, setGame] = useState(null);
  const [scale, setScale] = useState(1);
  const [endGame, setEndGame] = useState(false);

	const gameMode = GAME_MODE[gameSetting.game_mode];

	useMemo(()=>{
		preloadBackground(gameMode.image);
	}, [])

  useEffect(() => {
    if (!user || !socket) return;

    if (!socket.connected) socket.connect();


    socket.emit("update-data", {
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      avatar: user.avatar,
    });

    socket.on("match-data", setGame);
    socket.on("game-state", setGame);

    return () => {
      socket.off("match-data", setGame);
      socket.off("game-state", setGame);
    };
  }, [user, socket]);

  useEffect(() => {
    const resize = () => {
      if (!wrapperRef.current) return;
      setScale(Math.min(wrapperRef.current.clientWidth / GAME_WIDTH, 1));
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleKey = e => {
      if (e.key === "w" || e.key === "ArrowUp")
        socket.emit("paddle-move", { direction: "up" });

      if (e.key === "s" || e.key === "ArrowDown")
        socket.emit("paddle-move", { direction: "down" });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [socket]);

  useEffect(() => {
    if (!game || !socket) return;

    if (game.state === "FINISHED") {
      setEndGame(true);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    let animationId;


    const render = () => {
      drawFrame(ctx, game, gameMode);
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [game, socket]);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {game && <ScoreBoard game={game} />}

      <div ref={wrapperRef} className="w-full max-w-5xl flex justify-center relative" style={{ height: GAME_HEIGHT * scale }}>
        <canvas ref={canvasRef} style={{ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale,}}
          className="rounded-2xl border border-white/60"/>
        {endGame && ( <GameResult game={game} width={GAME_WIDTH * scale} height={GAME_HEIGHT * scale}/>)}
      </div>

      <p className="text-md opacity-60 mt-3 mb-12">
        First to 10 points wins
      </p>
    </div>
  );
}
