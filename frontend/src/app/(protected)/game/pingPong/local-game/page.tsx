// import { PingPongGame } from "./game"

// export default function LocalGame (){
// 	return(
// 		<PingPongGame p1data={""} p2data={""}/>
// 	)
// }


"use client";

import React, { useMemo } from "react";
import { PingPongGame } from "./game";
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

  return (
    <PingPongGame
      p1={user}
      p2={opponent}
      gameSetting={gameSetting}
      gameMode={gameMode}
    />
  );
}
