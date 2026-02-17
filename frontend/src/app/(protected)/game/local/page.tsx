"use client";

import PongGame from "@/components/ui/game";
import { assets } from "@/assets/data";

type PlayerInput = {
	firstname?: string;
	lastname?: string;
  nickName?: string;
  username?: string;
  avatar?: any;
};

export default function LocalGame() {

	const player1: PlayerInput = {
		firstname: "Default",
		lastname: "Player1",
		nickName: "Default",
		username: "Default",
		avatar: assets.defaultProfile,
	};
	const player2: PlayerInput = {
		firstname: "Default",
		lastname: "Player2",
		nickName: "Default",
		username: "Default",
		avatar: assets.defaultProfile,
	};

	return (
		<PongGame player1={player1} player2={player2} />
	);
}
