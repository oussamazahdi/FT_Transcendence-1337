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

export default function LocalGame() {
  const { user, gameSetting } = useAuth();

  const gameMode = useMemo(() => {
    const key = gameSetting?.game_mode;
    return key ? GAME_MODE?.[key] : null;
  }, [gameSetting]);

  // TODO: replace with real opponent once matchmaking exists
  const opponent = useMemo(
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
