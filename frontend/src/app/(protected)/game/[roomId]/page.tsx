"use client";

import { GAME_MODE, GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMatch, useSocket } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";
import type { User } from "@/types/index";
import { GameResult } from "./components/GameResult";
import { ScoreBoard } from "./components/PlayerCard";
import { drawFrame, preloadBackground } from "./lib/utils";
import { useParams } from "next/navigation";

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
  id: string | number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
};

type GameSocket = {
  connected: boolean;
  connect: () => void;
  emit(event: "update-data", payload: UpdateDataPayload): void;
  emit(event: "paddle-move", payload: { direction: "up" | "down" | "stop" }): void;
  on(event: "match-data" | "game-state", cb: (game: GameState) => void): void;
  off(event: "match-data" | "game-state", cb: (game: GameState) => void): void;
};

function isGameModeKey(v: unknown): v is keyof typeof GAME_MODE {
  return typeof v === "string" && v in GAME_MODE;
}

export default function GamePage() {
  const socket = useSocket() as GameSocket | null;
  const { activeMatch } = useMatch();
  const params = useParams<{ roomId?: string | string[] }>();

  const { user, gameSetting } = useAuth() as {
    user: User | null;
    gameSetting: { game_mode?: unknown } | Record<string, unknown>;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<GameState | null>(null);
  const upPressedRef = useRef(false);
  const downPressedRef = useRef(false);
  const lastDirectionRef = useRef<"up" | "down" | "stop">("stop");

  const [game, setGame] = useState<GameState | null>(null);
  const [scale, setScale] = useState(1);
  const [endGame, setEndGame] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const currentRoomId = useMemo(() => {
    const raw = params?.roomId;
    if (Array.isArray(raw)) return raw[0] ?? "";
    return raw ?? "";
  }, [params]);

  const defaultGameMode = useMemo(() => {
    const firstKey = Object.keys(GAME_MODE)[0] as keyof typeof GAME_MODE | undefined;
    return firstKey ? (GAME_MODE[firstKey] as GameMode) : (undefined as unknown as GameMode);
  }, []);

  const gameModeKey = (gameSetting as { game_mode?: unknown })?.game_mode;
  const gameMode: GameMode = useMemo(() => {
    if (isGameModeKey(gameModeKey)) return GAME_MODE[gameModeKey] as GameMode;
    return defaultGameMode;
  }, [gameModeKey, defaultGameMode]);

  useEffect(() => {
    const img = (gameMode as any)?.image as string | undefined;
    if (!img) return;
    preloadBackground(img);
  }, [ gameMode]);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    if (!user || !socket) return;

    if (!socket.connected) socket.connect();

    socket.emit("update-data", {
      id: user.id,
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

    const emitDirection = (direction: "up" | "down" | "stop") => {
      if (lastDirectionRef.current === direction) return;
      socket.emit("paddle-move", { direction });
      lastDirectionRef.current = direction;
    };

    const syncDirection = () => {
      if (upPressedRef.current && !downPressedRef.current) {
        emitDirection("up");
        return;
      }
      if (downPressedRef.current && !upPressedRef.current) {
        emitDirection("down");
        return;
      }
      emitDirection("stop");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") {
        e.preventDefault();
        upPressedRef.current = true;
        syncDirection();
      }
      if (e.key === "s" || e.key === "ArrowDown") {
        e.preventDefault();
        downPressedRef.current = true;
        syncDirection();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") {
        upPressedRef.current = false;
        syncDirection();
      }
      if (e.key === "s" || e.key === "ArrowDown") {
        downPressedRef.current = false;
        syncDirection();
      }
    };

    const handleBlur = () => {
      upPressedRef.current = false;
      downPressedRef.current = false;
      syncDirection();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      handleBlur();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [socket]);

  useEffect(() => {
    gameRef.current = game;
    if (!game) return;
    setEndGame(game.state === "FINISHED");
  }, [game]);

  useEffect(() => {
    const activeRoomId = activeMatch?.roomId == null ? "" : String(activeMatch.roomId);
    if (!activeRoomId || activeRoomId !== currentRoomId || !activeMatch?.ts) {
      setCountdown(null);
      return;
    }

    const durationMs = 3000;
    const updateCountdown = () => {
      const elapsed = Date.now() - activeMatch.ts;
      const remaining = durationMs - elapsed;
      if (remaining <= 0) {
        setCountdown(null);
        return false;
      }
      setCountdown(Math.ceil(remaining / 1000));
      return true;
    };

    if (!updateCountdown()) return;

    const timer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(timer);
    }, 100);

    return () => window.clearInterval(timer);
  }, [activeMatch, currentRoomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    let animationId = 0;

    const render = () => {
      if (gameRef.current) {
        drawFrame(ctx, gameRef.current, gameMode);
      }
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [gameMode]);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {game && <ScoreBoard game={game} />}

      <div ref={wrapperRef} className="w-full max-w-5xl flex justify-center relative" style={{ height: GAME_HEIGHT * scale }}>
        <canvas ref={canvasRef} style={{ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale }} className="rounded-2xl border border-white/60"/>
        {countdown ? (
          <div
            className="absolute top-0 left-0 rounded-2xl bg-black/55 flex flex-col items-center justify-center text-white"
            style={{ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale }}
          >
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">Match Starts In</p>
            <p className="text-6xl md:text-8xl font-black leading-none">{countdown}</p>
          </div>
        ) : null}
        {endGame && game && (<GameResult game={game} width={GAME_WIDTH * scale} height={GAME_HEIGHT * scale}/>)}
      </div>

      <p className="text-md opacity-60 mt-3 mb-12">First to 10 points wins</p>
    </div>
  );
}
