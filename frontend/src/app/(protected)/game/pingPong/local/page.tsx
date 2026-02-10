"use client";

type PlayerInput = {
	firstname?: string;
	lastname?: string;
  nickName?: string;
  username?: string;
  avatar?: string;
};

import React, { useMemo } from "react";
// import { PingPongGame } from "./game";
import PongGame from "@/components/ui/game";
import { GAME_MODE } from "@/components/ui/GameMode";
import { useAuth } from "@/contexts/authContext";
import type { User } from "@/types/index";

type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE] | null;

type Opponent = {
  username: string;
  avatar: string;
};

export default function LocalGame() {
  const { user, gameSetting } = useAuth() as {
    user: User | null;
    gameSetting: { game_mode?: keyof typeof GAME_MODE } | Record<string, unknown>;
  };

  const gameMode = useMemo<GameMode>(() => {
    const key = (gameSetting as { game_mode?: keyof typeof GAME_MODE })?.game_mode;
    return key ? GAME_MODE?.[key] : null;
  }, [gameSetting]);

  // TODO: replace with real opponent once matchmaking exists
const opponent = useMemo<Opponent>(
	() => ({ username: "Player 2", avatar: "/gameAvatars/Empty.jpeg" }),
	[]
);

const player1 : PlayerInput = {
	firstname: "oussama",
	lastname: "zahdi",
  nickName: "ozahdi",
  username: "ozahdi",
  avatar: user?.avatar || undefined, // Fallback to undefined if user?.avatar is null
}
const player2 : PlayerInput = {
	firstname: "kamal",
	lastname: "el alami",
  nickName: "kael-ala",
  username: "kael-ala",
  avatar: user?.avatar || undefined, // Fallback to undefined if user?.avatar is null
}

return (
	<PongGame player1={player1} player2={player2} />
	// <PingPongGame
	//   p1={player1}
	//   p2={opponent}
	//   gameSetting={gameSetting}
	//   gameMode={gameMode}
	// />
);
}
