"use client";

import { GAME_MODE, GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";
import type { User } from "@/types/index";
import { GameResult } from "./components/GameResult";
import { ScoreBoard } from "./components/PlayerCard";
import { drawFrame, preloadBackground } from "./lib/utils";

type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE];

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PlayerInfo = {
  username: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  score: number;
  player: Paddle;
};

type GameBall = {
  x: number;
  y: number;
  radius: number;
};

type GameState = {
  ball: GameBall;
  player1: PlayerInfo;
  player2: PlayerInfo;
  state?: string;
  [key: string]: unknown;
};

type UpdateDataPayload = {
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
};

type GameSocket = {
  connected: boolean;
  connect: () => void;
  emit(event: "update-data", payload: UpdateDataPayload): void;
  emit(event: "paddle-move", payload: { direction: "up" | "down" }): void;
  on(event: "match-data" | "game-state", cb: (game: GameState) => void): void;
  off(event: "match-data" | "game-state", cb: (game: GameState) => void): void;
};

export default function GamePage() {
  const socket = useSocket() as GameSocket | null;
  const { user, gameSetting } = useAuth() as {
    user: User | null;
    gameSetting: { game_mode?: keyof typeof GAME_MODE } | Record<string, unknown>;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [game, setGame] = useState<GameState | null>(null);
  const [scale, setScale] = useState(1);
  const [endGame, setEndGame] = useState(false);

  const gameMode = GAME_MODE[(gameSetting as { game_mode?: keyof typeof GAME_MODE })?.game_mode as keyof typeof GAME_MODE] as GameMode;

  useMemo(() => {
    preloadBackground(gameMode.image);
  }, [gameMode.image]);

	useEffect(() => {
		document.body.classList.add("no-scroll");
		document.documentElement.classList.add("no-scroll"); // html too (mobile/Safari)
	
		return () => {
			document.body.classList.remove("no-scroll");
			document.documentElement.classList.remove("no-scroll");
		};
	}, []);
	

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

    const handleKey = (e: KeyboardEvent) => {
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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    let animationId : any;


    const render = () => {
      drawFrame(ctx, game, gameMode);
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [game, socket, gameMode]);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {game && <ScoreBoard game={game} />}

      <div
        ref={wrapperRef}
        className="w-full max-w-5xl flex justify-center relative"
        style={{ height: GAME_HEIGHT * scale }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale }}
          className="rounded-2xl border border-white/60"
        />
        {endGame && game && (
          <GameResult
            game={game}
            width={GAME_WIDTH * scale}
            height={GAME_HEIGHT * scale}
          />
        )}
      </div>

      <p className="text-md opacity-60 mt-3 mb-12">
        First to 10 points wins
      </p>
    </div>
  );
}
