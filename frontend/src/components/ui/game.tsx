"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextImage from "next/image";
import { GAME_MODE, GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";
import { useAuth } from "@/contexts/authContext";
import { GameUtiles } from "./utils";
import { LocalGameResult } from "./LocalGameResult";


const TOURNAMENT_PAGE_ROUTE = "/game/tournament";

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
    setScore2: React.Dispatch<React.SetStateAction<number>>,
    baseBallSpeed: number
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

type LocalGameData = {
  player1NickName?: string;
  player1Avatar?: string;
  player2NickName?: string;
  player2Avatar?: string;

  paddleColor?: string;
  ballColor?: string;
  boardColor?: string;

  scoreLimit?: number;
  paddleSize?: number;

  player1Score?: number;
  player2Score?: number;
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readLocalGameData(): LocalGameData | null {
  if (typeof window === "undefined") return null;
  return safeParse<LocalGameData>(localStorage.getItem("GameData"));
}

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

function setMatchResult(state: TournamentState, matchId: string, scoreA: number, scoreB: number): TournamentState {
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

let gameMapImg: HTMLImageElement | null = null;
let bgReady = false;

function preloadBackground(imageUrl?: string | null) {
  if (!imageUrl) return;
  if (gameMapImg?.src === imageUrl) return;

  bgReady = false;
  if (typeof window === "undefined") return;

  const img = new window.Image();
  img.src = imageUrl;
  img.onload = () => {
    bgReady = true;
  };
  img.onerror = () => {
    bgReady = false;
  };

  gameMapImg = img;
}

function getBackgroundImage(): BackgroundImage {
  return { image: gameMapImg, ready: bgReady };
}

const DEFAULT_AVATAR = "/gameAvatars/Empty.jpeg";

const toNumber = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toConfiguredBallSpeed = (v: unknown, fallback: number) => {
  const n = Math.round(toNumber(v, fallback));
  return Math.min(3, Math.max(1, n));
};

const BALL_SPEED_SCALE = 2;

const toRuntimeBallSpeed = (configuredBallSpeed: number) => configuredBallSpeed * BALL_SPEED_SCALE;

const shortenName = (value: string, max = 12) => {
  const text = value.trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(1, max - 1))}…`;
};

type LocalOverrides = {
  paddleColor?: string;
  ballColor?: string;
  boardColor?: string;
  scoreLimit?: number;
  paddleSize?: number;
};

const buildPlayers = ({
  player1,
  player2,
  mode,
  overrides,
}: {
  player1?: PlayerInput | null;
  player2?: PlayerInput | null;
  mode?: GameMode;
  overrides?: LocalOverrides | null;
}): PlayersConfig => {
  const paddleColor = overrides?.paddleColor ?? mode?.paddle ?? "#D9D9D9";
  const ballColor = overrides?.ballColor ?? mode?.ball ?? "#D9D9D9";
  const boardColor = overrides?.boardColor ?? "#262626";

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
    boardColor,
    ballColor,
  };
};

const initGameState = ({
  gameSetting,
  mode,
  scoreLimitOverride,
  overrides,
}: {
  gameSetting?: GameSetting | null;
  mode?: GameMode;
  scoreLimitOverride?: number | null;
  overrides?: LocalOverrides | null;
}): GameState => {
  const width = GAME_WIDTH || 1024;
  const height = GAME_HEIGHT || 700;

  const paddleSize = toNumber(overrides?.paddleSize ?? gameSetting?.paddle_size, 1);
  const paddleHeight = 90 + 15 * paddleSize;

  const configuredBallSpeed = toConfiguredBallSpeed(gameSetting?.ball_speed, 2);
  const runtimeBallSpeed = toRuntimeBallSpeed(configuredBallSpeed);

  const scoreLimit =
    typeof scoreLimitOverride === "number" && Number.isFinite(scoreLimitOverride)
      ? scoreLimitOverride
      : toNumber(overrides?.scoreLimit ?? gameSetting?.score_limit, 5);

  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
  const direction = Math.random() > 0.5 ? 1 : -1;

  preloadBackground(mode?.image);

  return {
    board: { width, height },
    ball: {
      x: width / 2,
      y: height / 2,
      velocityX: Math.cos(angle) * direction,
      velocityY: Math.sin(angle),
      speed: runtimeBallSpeed,
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

  const urlMode = searchParams.get("mode");
  const matchId = searchParams.get("matchId");

  const scoreLimitOverride = useMemo(() => {
    const raw = searchParams.get("scoreLimit");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [searchParams]);

  const { gameSetting: rawGameSetting } = useAuth();
  const gameSetting = useMemo<GameSetting | null>(() => {
    const value: unknown = rawGameSetting;
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as GameSetting;
  }, [rawGameSetting]);

  const mode = useMemo<GameMode>(() => {
    const gm = gameSetting?.game_mode;
    if (!gm) return null;

    if (typeof gm === "object") return gm as GameMode;

    if (typeof gm === "string" && gm in GAME_MODE) {
      return GAME_MODE[gm as keyof typeof GAME_MODE] ?? null;
    }

    return null;
  }, [gameSetting?.game_mode]);

  useEffect(() => {
    preloadBackground(mode?.image ?? null);
  }, [mode?.image]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const isPauseRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const storedResultRef = useRef(false);

  const [localPlayers, setLocalPlayers] = useState<{ p1: PlayerInput | null; p2: PlayerInput | null }>({
    p1: null,
    p2: null,
  });
  const [localOverrides, setLocalOverrides] = useState<LocalOverrides | null>(null);

  useEffect(() => {
    if (urlMode === "tournament") return;

    const data = readLocalGameData();
    if (!data) {
      setLocalPlayers({ p1: null, p2: null });
      setLocalOverrides(null);
      return;
    }

    setLocalPlayers({
      p1: {
        nickName: data.player1NickName ?? "Player 1",
        avatar: data.player1Avatar ?? DEFAULT_AVATAR,
      },
      p2: {
        nickName: data.player2NickName ?? "Player 2",
        avatar: data.player2Avatar ?? DEFAULT_AVATAR,
      },
    });

    setLocalOverrides({
      paddleColor: data.paddleColor,
      ballColor: data.ballColor,
      boardColor: data.boardColor,
      scoreLimit: typeof data.scoreLimit === "number" ? data.scoreLimit : undefined,
      paddleSize: typeof data.paddleSize === "number" ? data.paddleSize : undefined,
    });
  }, [urlMode]);

  function tournamentPlayerToInput(p: TournamentPlayer): PlayerInput {
    return {
      username: p.username,
      nickName: p.username || p.displayName,
      avatar: p.avatarUrl ?? undefined,
    };
  }

  const [tournamentPlayers, setTournamentPlayers] = useState<{ p1: PlayerInput | null; p2: PlayerInput | null }>({
    p1: null,
    p2: null,
  });

  useEffect(() => {
    if (urlMode !== "tournament" || !matchId) {
      setTournamentPlayers({ p1: null, p2: null });
      return;
    }

    const existing = safeParse<TournamentState>(localStorage.getItem("tournament:state"));
    if (!existing) {
      setTournamentPlayers({ p1: null, p2: null });
      return;
    }

    const match = findTournamentMatch(existing, matchId);
    if (!match) {
      setTournamentPlayers({ p1: null, p2: null });
      return;
    }

    setTournamentPlayers({
      p1: tournamentPlayerToInput(match.a),
      p2: tournamentPlayerToInput(match.b),
    });
  }, [urlMode, matchId]);

  const effectiveP1 = urlMode === "tournament" ? tournamentPlayers.p1 : localPlayers.p1 ?? player1;
  const effectiveP2 = urlMode === "tournament" ? tournamentPlayers.p2 : localPlayers.p2 ?? player2;

  const mergedScoreLimitOverride = localOverrides?.scoreLimit ?? scoreLimitOverride;

  const gameStateRef = useRef<GameState>(
    initGameState({ gameSetting, mode, scoreLimitOverride: mergedScoreLimitOverride, overrides: localOverrides })
  );

  const [players, setPlayers] = useState<PlayersConfig>(() =>
    buildPlayers({ player1: effectiveP1, player2: effectiveP2, mode, overrides: localOverrides })
  );

  const togglePause = useCallback(() => {
    setIsPause((prev) => {
      const next = !prev;
      isPauseRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    gameStateRef.current = initGameState({
      gameSetting,
      mode,
      scoreLimitOverride: mergedScoreLimitOverride,
      overrides: localOverrides,
    });

    setPlayers(buildPlayers({ player1: effectiveP1, player2: effectiveP2, mode, overrides: localOverrides }));

    setScore1(0);
    setScore2(0);
    setGameOver(false);
    setWinner("");
    setIsPause(false);
    isPauseRef.current = false;
    storedResultRef.current = false;
  }, [
    gameSetting,
    mode,
    mergedScoreLimitOverride,
    localOverrides,
    urlMode,
    player1,
    player2,
    localPlayers,
    tournamentPlayers,
    matchId,
		effectiveP1,
		effectiveP2
  ]);

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

    const baseBallSpeed = toRuntimeBallSpeed(toConfiguredBallSpeed(gameSetting?.ball_speed, 2));

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!isPauseRef.current && !gameOver) {
        context.clearRect(0, 0, state.board.width, state.board.height);

        GameUtilesTyped.paddleMovement(state);
        GameUtilesTyped.ballCollisions(state);
        GameUtilesTyped.handleScoring(state, setScore1, setScore2, baseBallSpeed);
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
  }, [players, gameOver, togglePause, gameSetting?.ball_speed]);

  useEffect(() => {
    if (!gameOver) return;
    if (urlMode !== "tournament") return;
    if (!matchId) return;
    if (storedResultRef.current) return;

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
    <div className="relative inset-x-0 flex flex-col items-center text-white space-y-6">
      <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
        <div className="flex gap-1 flex-col items-center">
          <NextImage
            src={players.player1.avatar}
            alt="player 1 avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-2xl font-semibold">{shortenName(players.player1.nickName)}</h3>
          <p className="text-xs text-[#858585]">w (up) / s (down)</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold">{`${score1} - ${score2}`}</p>
        </div>

        <div className="flex gap-1 flex-col items-center">
          <NextImage src={players.player2.avatar} alt="player 2 avatar" width={80} height={80}
            className="w-20 h-20 rounded-lg object-cover"/>
          <h3 className="text-2xl font-semibold">{shortenName(players.player2.nickName)}</h3>
          <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
        </div>
      </div>

      <div className="mx-4 w-full flex justify-center">
        <div className="relative w-full max-w-240">
          <canvas
            ref={canvasRef}
            width={gameStateRef.current.board.width}
            height={gameStateRef.current.board.height}
            className="w-full rounded-2xl border border-white/20"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/25" />
          {gameOver ? (
            <LocalGameResult
              winnerName={shortenName(
                winner || (score1 > score2 ? players.player1.nickName : players.player2.nickName),
                16
              )}
              score1={score1}
              score2={score2}
              isTournament={urlMode === "tournament"}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-row gap-6 mb-4">
        <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition"
          onClick={togglePause} disabled={gameOver} title={gameOver ? "Game finished" : undefined} type="button">
          {isPause ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
