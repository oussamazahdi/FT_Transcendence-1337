"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GameUtiles } from "./utils";
import { GAME_MODE, GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";
import { useAuth } from "@/contexts/authContext";

/**
 * What this version adds (tournament mode):
 * - When gameOver === true AND urlMode === "tournament" AND matchId exists:
 *   1) store match result in localStorage ("tournament:state")
 *   2) after 3 seconds redirect back to Tournament page
 *
 * Adjust this if your tournament page route is different:
 */
const TOURNAMENT_PAGE_ROUTE = "/game/pingPong/tournament";

// ---------------- Types ----------------
type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE] | null;

type PlayerInput = {
  firstname?: string;
  lastname?: string;
  nickName?: string;
  username?: string;
  avatar?: string;
};

type PlayersConfig = {
  player1: { firstname: string; lastname: string; nickName: string; avatar: string; color: string };
  player2: { firstname: string; lastname: string; nickName: string; avatar: string; color: string };
  boardColor: string;
  ballColor: string;
};

type Board = { width: number; height: number };

type Ball = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  radius: number;
};

type Paddle = { x: number; y: number; width: number; height: number };

type KeysState = { w: boolean; s: boolean; ArrowUp: boolean; ArrowDown: boolean };

type GameState = {
  board: Board;
  ball: Ball;
  player1: Paddle;
  player2: Paddle;
  keys: KeysState;
  scoreLimit: number;
};

type GameSetting = {
  game_mode?: keyof typeof GAME_MODE | GameMode;
  paddle_size?: number;
  ball_speed?: number;
  score_limit?: number;
  [key: string]: unknown;
};

type BackgroundImage = { image: HTMLImageElement | null; ready: boolean };

type GameUtilesType = {
  drawLocalFrame: (
    context: CanvasRenderingContext2D,
    state: GameState,
    players: PlayersConfig,
    bg: BackgroundImage
  ) => void;
  ballMovement: (state: GameState) => void;
  handleScoring: (
    state: GameState,
    setScore1: React.Dispatch<React.SetStateAction<number>>,
    setScore2: React.Dispatch<React.SetStateAction<number>>
  ) => void;
  ballCollisions: (state: GameState) => void;
  paddleMovement: (state: GameState) => void;
  createKeyboardHandlers: (args: {
    stateRef: React.MutableRefObject<GameState>;
    togglePause: () => void;
  }) => {
    onKeyDown: (e: KeyboardEvent) => void;
    onKeyUp: (e: KeyboardEvent) => void;
  };
};

const GameUtilesTyped = GameUtiles as GameUtilesType;

// ---------------- Tournament persistence types/helpers ----------------
type TournamentPlayer = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
};

type MatchStatus = "locked" | "ready" | "in_progress" | "completed";

type TournamentMatch = {
  id: string;
  round: 1 | 2;
  a: TournamentPlayer;
  b: TournamentPlayer;
  status: MatchStatus;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
  loserId?: string;
};

type TournamentState = {
  name: string;
  players: TournamentPlayer[];
  semis: TournamentMatch[];
  final: TournamentMatch;
  currentMatchId: string;
  createdAt: string;
  updatedAt: string;
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function saveTournamentState(state: TournamentState) {
  localStorage.setItem("tournament:state", JSON.stringify(state));
}

function findTournamentMatch(state: TournamentState, matchId: string): TournamentMatch | null {
  const semi = state.semis.find((m) => m.id === matchId);
  if (semi) return semi;
  if (state.final.id === matchId) return state.final;
  return null;
}

function getWinner(match: TournamentMatch): TournamentPlayer | null {
  if (!match.winnerId) return null;
  return match.winnerId === match.a.id ? match.a : match.b;
}

function computeNextCurrentMatchId(state: TournamentState): string {
  const [m1, m2] = state.semis;
  if (m1.status !== "completed") return m1.id;
  if (m2.status !== "completed") return m2.id;
  if (state.final.status !== "completed") return state.final.id;
  return state.final.id;
}

function advanceLocks(state: TournamentState): TournamentState {
  const next = structuredClone(state);

  if (!Array.isArray(next.semis) || next.semis.length < 2) {
    next.updatedAt = new Date().toISOString();
    return next;
  }

  const semi1 = next.semis[0];
  const semi2 = next.semis[1];

  if (semi1.status === "completed" && semi2.status === "locked") {
    semi2.status = "ready";
  }

  const w1 = getWinner(semi1);
  const w2 = getWinner(semi2);

  if (w1 && w2) {
    next.final.a = w1;
    next.final.b = w2;
    if (next.final.status === "locked") next.final.status = "ready";
  }

  next.currentMatchId = computeNextCurrentMatchId(next);
  next.updatedAt = new Date().toISOString();
  return next;
}

function setMatchResult(
  state: TournamentState,
  matchId: string,
  scoreA: number,
  scoreB: number
): TournamentState {
  // no draws
  if (scoreA === scoreB) return state;

  const next = structuredClone(state);
  const m = findTournamentMatch(next, matchId);
  if (!m) return state;

  const winner = scoreA > scoreB ? m.a : m.b;
  const loser = scoreA > scoreB ? m.b : m.a;

  m.scoreA = scoreA;
  m.scoreB = scoreB;
  m.winnerId = winner.id;
  m.loserId = loser.id;
  m.status = "completed";

  return advanceLocks(next);
}

// ---------------- Background preload (module scope cache) ----------------
let gameMapImg: HTMLImageElement | null = null;
let bgReady = false;

export function preloadBackground(imageUrl?: string | null) {
  if (!imageUrl) return;
  if (gameMapImg && gameMapImg.src === imageUrl) return;

  bgReady = false;
  gameMapImg = new Image();
  gameMapImg.src = imageUrl;
  gameMapImg.onload = () => (bgReady = true);
  gameMapImg.onerror = () => (bgReady = false);
}

export function getBackgroundImage(): BackgroundImage {
  return { image: gameMapImg, ready: bgReady };
}

const DEFAULT_AVATAR = "/gameAvatars/Empty.jpeg";

const toNumber = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const buildPlayers = ({
  player1,
  player2,
  mode,
}: {
  player1?: PlayerInput | null;
  player2?: PlayerInput | null;
  mode?: GameMode;
}): PlayersConfig => {
  const paddleColor = mode?.paddle ?? "#D9D9D9";
  const ballColor = mode?.ball ?? "#D9D9D9";

  return {
    player1: {
      firstname: player1?.firstname || "FirstName1",
      lastname: player1?.lastname || "LastName1",
      nickName: player1?.nickName || player1?.username || "Player 1",
      avatar: player1?.avatar || DEFAULT_AVATAR,
      color: paddleColor,
    },
    player2: {
      firstname: player2?.firstname || "FirstName2",
      lastname: player2?.lastname || "LastName2",
      nickName: player2?.nickName || player2?.username || "Player 2",
      avatar: player2?.avatar || DEFAULT_AVATAR,
      color: paddleColor,
    },
    boardColor: "#262626",
    ballColor,
  };
};

const initGameState = ({
  gameSetting,
  mode,
  scoreLimitOverride,
}: {
  gameSetting?: GameSetting | null;
  mode?: GameMode;
  scoreLimitOverride?: number | null;
}): GameState => {
  const width = GAME_WIDTH || 1024;
  const height = GAME_HEIGHT || 700;

  const paddleSize = toNumber(gameSetting?.paddle_size, 1);
  const paddleHeight = 90 + 15 * paddleSize;

  const ballSpeed = toNumber(gameSetting?.ball_speed, 3);

  const scoreLimit =
    typeof scoreLimitOverride === "number" && Number.isFinite(scoreLimitOverride)
      ? scoreLimitOverride
      : toNumber(gameSetting?.score_limit, 5);

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
    player1: { x: 40, y: height / 2 - paddleHeight / 2, width: 15, height: paddleHeight },
    player2: { x: width - 60, y: height / 2 - paddleHeight / 2, width: 15, height: paddleHeight },
    keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
    scoreLimit,
  };
};

type PongGameProps = { player1?: PlayerInput | null; player2?: PlayerInput | null };

export default function PongGame({ player1, player2 }: PongGameProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // from URL: /game/pingPong/local?mode=tournament&matchId=123
  const urlMode = searchParams.get("mode"); // "tournament"
  const matchId = searchParams.get("matchId"); // string | null

  const scoreLimitOverride = useMemo(() => {
    const raw = searchParams.get("scoreLimit");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [searchParams]);

  const { gameSetting } = useAuth() as unknown as { gameSetting?: GameSetting | null };

  const mode = useMemo<GameMode>(() => {
    const gm = gameSetting?.game_mode;
    if (!gm) return null;

    if (typeof gm === "object") return gm as GameMode;

    if (typeof gm === "string" && gm in GAME_MODE) {
      return GAME_MODE[gm as keyof typeof GAME_MODE] ?? null;
    }

    return null;
  }, [gameSetting?.game_mode]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const isPauseRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const storedResultRef = useRef(false);

  const gameStateRef = useRef<GameState>(initGameState({ gameSetting, mode, scoreLimitOverride }));

  const [players, setPlayers] = useState<PlayersConfig>(() => buildPlayers({ player1, player2, mode }));

  const togglePause = useCallback(() => {
    setIsPause((prev) => {
      const next = !prev;
      isPauseRef.current = next;
      return next;
    });
  }, []);

  // Re-init on dependencies
  useEffect(() => {
    gameStateRef.current = initGameState({ gameSetting, mode, scoreLimitOverride });
    setPlayers(buildPlayers({ player1, player2, mode }));

    setScore1(0);
    setScore2(0);
    setGameOver(false);
    setWinner("");
    setIsPause(false);
    isPauseRef.current = false;

    storedResultRef.current = false;
  }, [player1, player2, gameSetting, mode, scoreLimitOverride]);

  // Decide game over based on score limit in state
  useEffect(() => {
    const limit = gameStateRef.current.scoreLimit;
    if (score1 >= limit) {
      setGameOver(true);
      setWinner(players.player1.nickName);
    } else if (score2 >= limit) {
      setGameOver(true);
      setWinner(players.player2.nickName);
    }
  }, [score1, score2, players]);

  // Main loop
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

  // ✅ Tournament: store match result + redirect after 3s
  useEffect(() => {
    if (!gameOver) return;
    if (urlMode !== "tournament") return;
    if (!matchId) return;
    if (storedResultRef.current) return;

    // prevent double-write
    storedResultRef.current = true;

    const existing = safeParse<TournamentState>(localStorage.getItem("tournament:state"));
    if (existing) {
      const next = setMatchResult(existing, matchId, score1, score2);
      saveTournamentState(next);
    }

    const t = window.setTimeout(() => {
      router.push(TOURNAMENT_PAGE_ROUTE);
    }, 3000);

    return () => window.clearTimeout(t);
  }, [gameOver, urlMode, matchId, score1, score2, router]);

  return (
    <div>
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
              <div className="mt-2 flex flex-col items-center gap-1">
                <p className="text-sm text-[#BDBDBD]">{winner ? `${winner} wins` : "Game over"}</p>
                {urlMode === "tournament" ? (
                  <p className="text-xs text-white/60">Returning to tournament in 3 seconds…</p>
                ) : null}
              </div>
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
          />
        </div>

        <div className="flex flex-row gap-6 mb-4">
          <button
            className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition"
            onClick={togglePause}
            disabled={gameOver}
            title={gameOver ? "Game finished" : undefined}
          >
            {isPause ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}
