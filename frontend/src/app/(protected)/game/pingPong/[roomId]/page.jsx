"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { io } from "socket.io-client";
import { useSocket } from "@/contexts/socketContext";

const GAME_WIDTH = 1024;
const GAME_HEIGHT = 700;

const socket = useSocket();

export default function Page() {
	const { user } = useAuth();

	const canvasRef = useRef(null);
	const wrapperRef = useRef(null);

	const [game, setGame] = useState(null);
	const [scale, setScale] = useState(1);
	const [endGame, setEndGame] = useState(false);

	useEffect(() => {
		if (!user) return;

		if (!socket.connected) socket.connect();

		socket.emit("update-data", {
			username: user.username,
			firstName: user.firstname,
			lastName: user.lastname,
			avatar: user.avatar,
		});

		socket.on("match-data", setGame);
		socket.on("game-state", setGame);

		return () => {
			socket.off("match-data", setGame);
			socket.off("game-state", setGame);
		};
	}, [user]);

	useEffect(() => {
		const resize = () => {
			if (!wrapperRef.current) return;
			setScale(
				Math.min(wrapperRef.current.clientWidth / GAME_WIDTH, 1)
			);
		};

		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, []);

	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === "w" || e.key === "ArrowUp")
				socket.emit("paddle-move", { direction: "up" });

			if (e.key === "s" || e.key === "ArrowDown")
				socket.emit("paddle-move", { direction: "down" });
		};

		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, []);

	useEffect(() => {
		if (!game) return;

		if (game.state === "FINISHED") {
			setEndGame(true);
			socket.disconnect();
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		canvas.width = GAME_WIDTH;
		canvas.height = GAME_HEIGHT;

		let animationId;

		const render = () => {
			drawFrame(ctx, game);
			animationId = requestAnimationFrame(render);
		};

		render();
		return () => cancelAnimationFrame(animationId);
	}, [game]);

	return (
		<div className="flex flex-col items-center w-full overflow-hidden">
			{game && <ScoreBoard game={game} />}

			<div
				ref={wrapperRef}
				className="w-full max-w-5xl flex justify-center relative"
				style={{ height: GAME_HEIGHT * scale }}
			>
				<canvas
					ref={canvasRef}
					style={{
						width: GAME_WIDTH * scale,
						height: GAME_HEIGHT * scale,
					}}
					className="rounded-2xl border border-white/60"
				/>

				{endGame && (
					<GameResult
						game={game}
						width={GAME_WIDTH * scale}
						height={GAME_HEIGHT * scale}
					/>
				)}
			</div>

			<p className="text-md opacity-60 mt-3 mb-12">
				First to 10 points wins
			</p>
		</div>
	);
}

function drawFrame(ctx, game) {
	ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

	ctx.setLineDash([15, 8]);
	ctx.beginPath();
	ctx.moveTo(GAME_WIDTH / 2, 0);
	ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
	ctx.strokeStyle = "#fff";
	ctx.stroke();

	ctx.setLineDash([]);
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
	ctx.fill();

	drawPaddle(ctx, game.player1.player);
	drawPaddle(ctx, game.player2.player);
}

function drawPaddle(ctx, paddle) {
	ctx.fillStyle = "white";
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function ScoreBoard({ game }) {
	return (
		<div className="flex justify-between w-full max-w-5xl px-4 mt-6 mb-5">
			<PlayerCard player={game.player1} />
			<p className="text-xl md:text-4xl font-bold">
				{game.player1.score} - {game.player2.score}
			</p>
			<PlayerCard player={game.player2} />
		</div>
	);
}

function PlayerCard({ player }) {
	return (
		<div className="flex flex-col items-center">
			<img
				src={player.avatar}
				className="w-14 h-14 rounded-lg object-cover"
			/>
			<p className="font-semibold">
				{player.firstName}.{player.lastName?.[0]}
			</p>
			<span className="text-sm text-gray-400">
				[{player.username}]
			</span>
		</div>
	);
}

function GameResult({ game, width, height }) {
	const winner = game.player1.score > game.player2.score ? game.player1 : game.player2;

	return (
		<div
			style={{ width, height }}
			className="absolute top-0 left-0 bg-black/60 flex flex-col items-center justify-center p-12 text-center text-white rounded-2xl"
		>
			<p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">
				Final Result
			</p>
			<h2 className="text-3xl md:text-5xl font-black uppercase italic mb-2 leading-none">
				{winner.username}
				<br />
				Wins
			</h2>
			<p className="text-xs md:text-sm opacity-60">
				Total Score: {game.player1.score} — {game.player2.score}
			</p>
		</div>
	);
}
