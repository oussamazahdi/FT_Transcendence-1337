"use client";

import { useAuth } from "@/contexts/authContext";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

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

export default function Matchmaking() {
	const { user } = useAuth();
	const router = useRouter();

	const [status, setStatus] = useState("Searching for opponent...");
	const [player1, setPlayer1] = useState(emptyPlayer());
	const [player2, setPlayer2] = useState(emptyPlayer());

	const joinedRef = useRef(false);

	useEffect(() => {
		if (!user) return;

		setPlayer1({ ...emptyPlayer(),
			firstName: user.firstname,
			lastName: user.lastname,
			username: user.username,
			avatar: user.avatar,
		});
	}, [user]);

	useEffect(() => {
		if (!user) return;
		if (!socket.connected) socket.connect();

		function handleConnect() {
			setPlayer1(prev => ({...prev,
				socketId: socket.id,
			}));

			if (!joinedRef.current) {
				socket.emit("join-game", {
					firstName: user.firstname,
					lastName: user.lastname,
					username: user.username,
					avatar: user.avatar,
				});
				joinedRef.current = true;
			}

			setStatus("Waiting for opponent...");
		};
		
		const handleMatchFound = opponent => {
			setPlayer2(opponent);
			setStatus("Match Found!");
		};
		
		const handleMatchCanceled = () => {
			console.log("❌ Match canceled"); // remove
			
			setPlayer2(emptyPlayer());
			setStatus("Opponent left. Searching again...");
			
			joinedRef.current = false;
			
			socket.emit("join-game", {
				firstName: user.firstname,
				lastName: user.lastname,
				username: user.username,
				avatar: user.avatar,
			});
		};

		const handleMatchStarted = roomId => {
			router.push(`/game/pingPong/${roomId}`);
			router.refresh()
		}

		socket.on("connect", handleConnect);
		socket.on("match-found", handleMatchFound);
		socket.on("match-canceled", handleMatchCanceled);
		socket.on("match-started", handleMatchStarted);
		
		return () => {
			socket.off("connect", handleConnect);
			socket.off("match-found", handleMatchFound);
			socket.off("match-canceled", handleMatchCanceled);
			socket.on("match-started", handleMatchStarted);
		};
	}, [user, router]);
	
	return (
		<div className="flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl">
			<h3 className="text-3xl font-extrabold">Find Match</h3>
			<h3 className="mb-6 text-white/50">{status}</h3>

			<div className="flex items-center justify-between gap-x-20">
				<PlayerCard player={player1}/>
				<span className="text-3xl font-extrabold">VS</span>
				<PlayerCard player={player2}/>

			</div>
		</div>
	);
}

function PlayerCard({player}) {
	return (
		<div className="flex flex-col items-center">
			<img
				src={
					player.socketId
						? player.avatar
						: "/gameAvatars/Empty.jpeg"
				}
				alt="profile"
				className="h-36 w-36 rounded-xl"
			/>
			<h3 className="text-xl font-semibold">
				{player.socketId
					? `${player.firstName}.${player.lastName?.[0]}`
					: "Player 2"}
			</h3>
			<h3 className="text-md font-medium text-[#6E6E6E]">
				[{player.socketId ? player.username : "waiting"}]
			</h3>
		</div>
	);
}