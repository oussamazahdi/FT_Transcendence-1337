"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
	transports: ["websocket"],
	autoConnect: false,
});

const emptyPlayer = () => ({
	socketId: "",
	firstName: "",
	lastName: "",
	username: "",
	avatar: "",
	score: 0,
	roomId: "",
});

export default function Page() {
	const { user } = useAuth();

	const [currentPlayer, setCurrentPlayer] = useState(null);
	const [player1, setPlayer1] = useState(emptyPlayer());
	const [player2, setPlayer2] = useState(emptyPlayer());
	const [roomId, setRoomId] = useState("");

	useEffect(() => {
		if (!user) return;

		setCurrentPlayer({
			username: user.username,
			firstName: user.firstname,
			lastName: user.lastname,
			avatar: user.avatar,
		});
	}, [user]);

	useEffect(() => {
		if (!currentPlayer) return;

		if (!socket.connected) socket.connect();

		socket.emit("update-data", currentPlayer);

		socket.on("match-data", game => {
			setPlayer1(game.player1.username === currentPlayer.username ? game.player1 : game.player2);
			setPlayer2(game.player1.username === currentPlayer.username ? game.player2 : game.player1);
			setRoomId(game.roomId);
		});

		return () => {
			socket.off("match-data");
		};
	}, [currentPlayer]);

	return (
		<div>
			<div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
        <div className="flex gap-1 flex-col items-center">
          <img
            src={player1.avatar}
            alt="player 1 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-xl font-semibold">{player1.firstName}.{player1.lastName[0]}</h3>
          <p className="text-md text-[#858585]">[{player1.username}]</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold">{`0 - 0`}</p>
        </div>

        <div className="flex gap-1 flex-col items-center">
          <img
            src={player2.avatar}
            alt="player 2 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-xl font-semibold">{player2.firstName}.{player2.lastName[0]}</h3>
          <p className="text-md text-[#858585]">[{player2.username}]</p>
        </div>
      </div>
		</div>
	);
}
