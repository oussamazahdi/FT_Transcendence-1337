"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameUtiles } from "./lib/utils";
import { GAME_MODE, GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";

type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE] | null;

type PlayerInput = {
  nickName?: string;
  username?: string;
  avatar?: string;
};

type PlayersConfig = {
  player1: { nickName: string; avatar: string; color: string };
  player2: { nickName: string; avatar: string; color: string };
  boardColor: string;
  ballColor: string;
};

type Board = {
  width: number;
  height: number;
};

type Ball = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  radius: number;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type KeysState = {
  w: boolean;
  s: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
};

type GameState = {
  board: Board;
  ball: Ball;
  player1: Paddle;
  player2: Paddle;
  keys: KeysState;
  scoreLimit: number;
};

type GameSetting = {
  game_mode?: keyof typeof GAME_MODE;
  paddle_size?: number;
  ball_speed?: number;
  score_limit?: number;
  [key: string]: unknown;
};

type BackgroundImage = { image: HTMLImageElement | null; ready: boolean };

type GameUtilesType = {
  drawLocalFrame: ( context: CanvasRenderingContext2D, state: GameState, players: PlayersConfig, bg: BackgroundImage) => void;
  ballMovement: (state: GameState) => void;
  handleScoring: ( state: GameState, setScore1: React.Dispatch<React.SetStateAction<number>>, setScore2: React.Dispatch<React.SetStateAction<number>>) => void;
  ballCollisions: (state: GameState) => void;
  paddleMovement: (state: GameState) => void;
  createKeyboardHandlers: (args: {stateRef: React.MutableRefObject<GameState>; togglePause: () => void; }) => {
    onKeyDown: (e: KeyboardEvent) => void;
    onKeyUp: (e: KeyboardEvent) => void;
  };
};

const GameUtilesTyped = GameUtiles as GameUtilesType;

let gameMapImg: HTMLImageElement | null = null;
let bgReady = false;

export function preloadBackground(imageUrl?: string | null) {
  if (!imageUrl) return;
  if (gameMapImg && gameMapImg.src === imageUrl) return;

  bgReady = false;
  gameMapImg = new Image();
  gameMapImg.src = imageUrl;
  gameMapImg.onload = () => {
    bgReady = true;
  };
  gameMapImg.onerror = () => {
    bgReady = false;
  };
}

export function getBackgroundImage(): BackgroundImage {
  return { image: gameMapImg, ready: bgReady };
}

const DEFAULT_AVATAR = "/gameAvatars/Empty.jpeg";

const toNumber = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const buildPlayers = ({ p1, p2, mode }: { p1?: PlayerInput | null; p2?: PlayerInput | null; mode?: GameMode; }): PlayersConfig => {

  const paddleColor = mode?.paddle || "#D9D9D9";
  const ballColor = mode?.ball || "#D9D9D9";

  return {
    player1: {
      nickName: p1?.nickName || p1?.username || "Player 1",
      avatar: p1?.avatar || DEFAULT_AVATAR,
      color: paddleColor,
    },
    player2: {
      nickName: p2?.nickName || p2?.username || "Player 2",
      avatar: p2?.avatar || DEFAULT_AVATAR,
      color: paddleColor,
    },
    boardColor: "#262626",
    ballColor,
  };
};

const initGameState = ({ gameSetting, mode, }: { gameSetting?: GameSetting | null; mode?: GameMode; }): GameState => {
  const width = GAME_WIDTH || 1024;
  const height = GAME_HEIGHT || 700;

  const paddleSize = toNumber(gameSetting?.paddle_size, 1);
  const paddleHeight = 90 + 15 * paddleSize;

  const ballSpeed = toNumber(gameSetting?.ball_speed, 3);
  const scoreLimit = toNumber(gameSetting?.score_limit, 5);

  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
  const direction = Math.random() > 0.5 ? 1 : -1;

  preloadBackground(mode?.image);

  return {
    board: { width, height },
    ball: {
      x: width / 2,
      y: height / 2,
      velocityX: Math.cos(angle) * ballSpeed * direction,
      velocityY: Math.sin(angle) * ballSpeed,
      speed: ballSpeed > 2 ? 0.6 * ballSpeed : 0.5 * ballSpeed,
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
    scoreLimit,
  };
};

export function PingPongGame({ p1, p2, gameSetting, gameMode }: { p1?: PlayerInput | null; p2?: PlayerInput | null; gameSetting?: GameSetting | null; gameMode?: GameMode; }) {
  const mode = useMemo<GameMode>(() => {
    if (gameMode) return gameMode;
    const key = gameSetting?.game_mode as keyof typeof GAME_MODE | undefined;
    return key ? GAME_MODE?.[key] : null;
  }, [gameMode, gameSetting]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const isPauseRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>(initGameState({ gameSetting, mode }));

  const [players, setPlayers] = useState<PlayersConfig>(() => buildPlayers({ p1, p2, mode }));

  const togglePause = useCallback(() => {
    setIsPause((prev) => {
      const next = !prev;
      isPauseRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    gameStateRef.current = initGameState({ gameSetting, mode });
    setPlayers(buildPlayers({ p1, p2, mode }));

    setScore1(0);
    setScore2(0);
    setGameOver(false);
    setWinner("");
    setIsPause(false);
    isPauseRef.current = false;
  }, [p1, p2, gameSetting, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const { onKeyDown, onKeyUp } = GameUtilesTyped.createKeyboardHandlers({
      stateRef: gameStateRef,
      togglePause,
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!isPauseRef.current && !gameOver) {
        context.clearRect(0, 0, state.board.width, state.board.height);

        GameUtilesTyped.paddleMovement(state);
        GameUtilesTyped.ballCollisions(state);
        GameUtilesTyped.handleScoring(state, setScore1, setScore2);
        GameUtilesTyped.ballMovement(state);

        GameUtilesTyped.drawLocalFrame(context, state, players, getBackgroundImage());
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [players, gameOver, togglePause]);

  return (
    <div className="relative inset-x-0 flex flex-col items-center text-white space-y-6">
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
          {gameOver ? (
            <p className="mt-1 text-sm text-[#BDBDBD]">
              {winner ? `${winner} wins` : "Game over"}
            </p>
          ) : null}
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

      <div className="mx-4 w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width={gameStateRef.current.board.width}
          height={gameStateRef.current.board.height}
          className="w-full max-w-240 rounded-2xl border border-white/20"
          style={{ backgroundColor: players.boardColor }}
        />
      </div>

      <div className="flex flex-row gap-6 mb-4">
        <button
          className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition"
          onClick={togglePause}
        >
          {isPause ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
