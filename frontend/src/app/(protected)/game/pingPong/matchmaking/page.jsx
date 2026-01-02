"use client";

import { useAuth } from "@/contexts/authContext";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

// const socket = io("http://localhost:3001", {
// 	transports: ["websocket"],
// 	autoConnect: false,
// });


const socket = io("http://localhost:3001", {
	transports: ["websocket"],
	autoConnect: false,
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
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
	const [canExit, setCanExit] = useState(true);
	const [isReconnecting, setIsReconnecting] = useState(false);

	const joinedRef = useRef(false);
	const hasNavigatedRef = useRef(false)

	useEffect(() => {
		if (!user) return;

		setPlayer1({ ...emptyPlayer(),
			firstName: user.firstname,
			lastName: user.lastname,
			username: user.username,
			avatar: user.avatar,
		});
	}, [user]);

	const handleExit = () => {
		if (!canExit) return;

		socket.emit("leave-game");
		joinedRef.current = false;
		hasNavigatedRef.current = true;
	
		setPlayer2(emptyPlayer());
		setStatus("You left the match");
	
		socket.disconnect();
		router.push("/game/pingPong");
	};

	useEffect(() => {
		if (!user) return;
		if (hasNavigatedRef.current) return;

		if (!socket.connected) socket.connect();

		function handleConnect() {
			setIsReconnecting(false);

			setPlayer1(prev => ({...prev,
				socketId: socket.id,
			}));

			if (!joinedRef.current) {
				console.log("🎮 Joining matchmaking...");
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
			setCanExit(false)
		};
		
		const handleMatchCanceled = () => {
			console.log("❌ Match canceled"); // remove
			
			setPlayer2(emptyPlayer());
			setStatus("Opponent left. Searching again...");
			setCanExit(true)
			
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
			<button onClick={canExit ? handleExit : undefined} className={`mt-6 rounded-md px-6 py-2 font-medium transition duration-100 ${
			canExit ? "bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] hover:text-[#BE3838]" : "bg-[#252525] text-[#717171] cursor-not-allowed"}`}>Exit</button>

			{/* <button onClick={handleExit} className="mt-6 rounded-md bg-[#442222] px-6 py-2 font-medium text-[#FF4848] hover:bg-[#3C1C1C] hover:text-[#BE3838] transition duration-100">Exit</button> */}
			{/* <button  className="mt-6 rounded-md bg-[#252525] px-6 py-2 font-medium text-[#717171]">Exit</button> */}

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
