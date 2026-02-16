"use client";

import PongGame from "@/components/ui/game";
import { useAuth } from "@/contexts/authContext";
import type { User } from "@/types/index";

type PlayerInput = {
	firstname?: string;
	lastname?: string;
  nickName?: string;
  username?: string;
  avatar?: string;
};

export default function LocalGame() {
  const { user } = useAuth() as {
    user: User | null;
  };

	const player1: PlayerInput = {
		firstname: "oussama",
		lastname: "zahdi",
		nickName: "ozahdi",
		username: "ozahdi",
		avatar: user?.avatar || undefined,
	};

	const player2: PlayerInput = {
		firstname: "kamal",
		lastname: "el alami",
		nickName: "kael-ala",
		username: "kael-ala",
		avatar: user?.avatar || undefined,
	};

	return (
		<PongGame player1={player1} player2={player2} />
	);
}
