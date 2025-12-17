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

		setPlayer1({
			...emptyPlayer(),
			firstName: user.firstname,
			lastName: user.lastname,
			username: user.username,
			avatar: user.avatar,
		});
	}, [user]);

	useEffect(() => {
		if (!user) return;

		if (!socket.connected)
			socket.connect();

		const handleConnect = () => {
			setPlayer1(prev => ({
				...prev,
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

		/* ---------- MATCH FOUND ---------- */
		const handleMatchFound = opponent => {
			setPlayer2(opponent);
			setStatus("Match Found!");
		};

		/* ---------- MATCH CANCELED ---------- */
		const handleMatchCanceled = () => {
			console.log("❌ Match canceled");

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

		/* ---------- OPPONENT LEFT ---------- */
		const handleOpponentLeft = () => {
			console.log("🏆 Opponent left");
			// setPlayer2({
			// 	socketId: "",
			// 	firstName: "",
			// 	lastName: "",
			// 	username: "",
			// 	avatar: "",
			// 	score: 0,
			// 	roomId: "",
			// })
			setStatus("Opponent disconnected. You win!");
		};

		socket.on("connect", handleConnect);
		socket.on("match-found", handleMatchFound);
		socket.on("match-canceled", handleMatchCanceled);
		socket.on("opponent-left", handleOpponentLeft);
		socket.on("start-match", ({roomId}) => {
			console.log("*******> player1.roomId:", roomId);
			router.push(`/game/pingPong/${roomId}`, undefined, { shallow: true });
			router.refresh()
		});

		return () => {
			socket.off("connect", handleConnect);
			socket.off("match-found", handleMatchFound);
			socket.off("match-canceled", handleMatchCanceled);
			socket.off("opponent-left", handleOpponentLeft);
		};
	}, [user, router]);

	return (
		<div className="flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl">
			<h3 className="text-3xl font-extrabold">Find Match</h3>
			<h3 className="mb-6 text-white/50">{status}</h3>

			<div className="flex items-center justify-between gap-x-20">
				{/* PLAYER 1 */}
				<div className="flex flex-col items-center">
					<img
						src={player1.avatar || "/gameAvatars/Empty.jpeg"}
						alt="profile"
						className="h-36 w-36 rounded-xl"
					/>
					<h3 className="text-xl font-semibold">
						{player1.firstName || "Player 1"}
						{player1.lastName ? "." + player1.lastName[0] : ""}
					</h3>
					<h3 className="text-md font-medium text-[#6E6E6E]">
						[{player1.username || "loading"}]
					</h3>
				</div>

				<span className="text-3xl font-extrabold">VS</span>

				{/* PLAYER 2 */}
				<div className="flex flex-col items-center">
					<img
						src={
							player2.socketId
								? player2.avatar
								: "/gameAvatars/Empty.jpeg"
						}
						alt="profile"
						className="h-36 w-36 rounded-xl"
					/>
					<h3 className="text-xl font-semibold">
						{player2.socketId
							? `${player2.firstName}.${player2.lastName?.[0]}`
							: "Player 2"}
					</h3>
					<h3 className="text-md font-medium text-[#6E6E6E]">
						[{player2.socketId ? player2.username : "waiting"}]
					</h3>
				</div>
			</div>
		</div>
	);
}