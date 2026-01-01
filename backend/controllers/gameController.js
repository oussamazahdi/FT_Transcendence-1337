import { GameSession, Paddle } from "../store/game.store.js";
import { randomUUID } from "crypto";

/*****************************************************************************/
const	PADDLESIZE = 120;
let		waitingPlayer = null;
const	activeGames = new Map();
const	loops = new Map();

/*****************************************************************************/
export function getGame(roomId) {
	return (activeGames.get(roomId));
}

export function createGame(game) {
	activeGames.set(game.roomId, game);
	return (game);
}

export function removeGame(roomId) {
	const loop = loops.get(roomId);
	if (loop) clearInterval(loop);
	
	loops.delete(roomId);
	activeGames.delete(roomId);
}

export function getGameBySocket(socketId) {
	for (const game of activeGames.values()) {
		if ( game.player1.socketId === socketId || game.player2.socketId === socketId)
			return (game);
	}
	return (null);
}

export function getGameByUsername(username) {
	for (const game of activeGames.values()) {
		if (game.player1.username === username || game.player2.username === username)
			return (game);
	}
	return (null);
}

export function startGameLoop(io, roomId) {
	if (loops.has(roomId)) return;

	const loop = setInterval(() => {
		updateGame(io, roomId);
	}, 1000 / 60);

	loops.set(roomId, loop);
}

/*****************************************************************************/
function matchFound(io, socket, playerData) {
	const game = new GameSession();
	game.roomId = randomUUID();

	
	Object.assign(game.player1, { ...waitingPlayer.playerData,
		socketId: waitingPlayer.socketId,
		roomId: game.roomId,
		player: new Paddle(40),
	});

	Object.assign(game.player2, { ...playerData,
		socketId: socket.id,
		roomId: game.roomId,
		player: new Paddle(1024 - 60),
	});

	game.state = "MATCHED";
	io.to(game.player1.socketId).emit("match-found", game.player2);
	io.to(game.player2.socketId).emit("match-found", game.player1);

	io.sockets.sockets.get(game.player1.socketId)?.join(game.roomId);
	io.sockets.sockets.get(game.player2.socketId)?.join(game.roomId);

	game.state = "PLAYING";
	activeGames.set(game.roomId, game);

	setTimeout(()=>{
		const checkGame = activeGames.get(game.roomId)
		if(checkGame)
			io.to(game.roomId).emit("match-started", game.roomId)
	},10000)

	return game;
}

export function handleJoin(socket, io, playerData) {
	if (!playerData?.username) return;

	const existingGame = getGameByUsername(playerData.username);
	if (existingGame) return;

	if (!waitingPlayer)
	{
		waitingPlayer = {
			socketId: socket.id,
			playerData,
		};
		return;
	}

	if (waitingPlayer.playerData.username === playerData.username)
		return;

	const game = matchFound(io, socket, playerData);
	startGameLoop(io, game.roomId);
	io.to(game.roomId).emit("match-data", game);
	waitingPlayer = null;
}

function updateGame(io, roomId) {
	const game = activeGames.get(roomId);
	if (!game || game.state !== "PLAYING") return;

	const ball = game.ball;
	const player1 = game.player1.player;
	const player2 = game.player2.player;

	if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= 700)
		ball.velocityY *= -1;

	if (ball.x - ball.radius <= player1.x + player1.width && ball.x > player1.x &&
	ball.y + ball.radius >= player1.y && ball.y - ball.radius <= player1.y + player1.height) {
		ball.speed += 0.2;
		ball.velocityX = Math.abs(ball.velocityX);
		ball.velocityY = ((ball.y - player1.y) / player1.height - 0.5) * 2;
	}

	if (ball.x + ball.radius >= player2.x && ball.x < player2.x + player2.width &&
	ball.y + ball.radius >= player2.y && ball.y - ball.radius <= player2.y + player2.height) {
		ball.speed += 0.2;
		ball.velocityX = -Math.abs(ball.velocityX);
		ball.velocityY = ((ball.y - player2.y) / player2.height - 0.5) * 2;
	}

	if (ball.x <= 0 || ball.x >= 1024) {
		if (ball.x <= 0) game.player2.score += 1;
		else game.player1.score += 1;

		ball.x = 512;
		ball.y = 350;
		ball.velocityX *= -1;
		ball.speed = 2.5;
	}

	if (game.player1.score === 10 || game.player2.score === 10) {
		game.state = "FINISHED";
		io.to(roomId).emit("game-state", game);
		removeGame(game.roomId);
	} else {
		ball.x += ball.velocityX * ball.speed;
		ball.y += ball.velocityY * ball.speed;
		io.to(roomId).emit("game-state", game);
	}
}

export function handleUpdateData(socket, io, playerData) {
	if (!playerData?.username) return;

	const game = getGameByUsername(playerData.username);
	if (!game) return;

	const player = game.player1.username === playerData.username ? game.player1 : game.player2;

	player.socketId = socket.id;
	socket.join(game.roomId);

	io.to(socket.id).emit("match-data", game);
	console.log("🔄 Reconnected:", player.username); // remove
}

export function handlePaddleMove(socket, io, paddle)
{
	const game = getGameBySocket(socket.id);
	const player = socket.id === game.player1.socketId ? game.player1 : game.player2;
	if (!game) return;
	
	if (paddle.direction === "up")
		{
			if (player.player.y - 14 <= 0)
				player.player.y = 0;
			else
			player.player.y -= 14;
	}
	else
	{
		if (player.player.y + PADDLESIZE + 14 >= 700)
			player.player.y = 700 - PADDLESIZE;
		else
		player.player.y += 14;
}

	io.to(game.roomId).emit("game-state", game);
}

export function handleDisconnect(socket, io) {
	console.log("❌ Disconnected:", socket.id); // remove

	if (waitingPlayer?.socketId === socket.id) {
		waitingPlayer = null;
		return;
	}

	const game = getGameBySocket(socket.id);
	if (!game) return;

	const remaining = game.player1.socketId === socket.id ? game.player2 : game.player1;
	removeGame(game.roomId);
	io.to(remaining.socketId).emit("match-canceled");
}

export function handleLeave(socket, io) {
	// If player is waiting
	if (waitingPlayer?.socketId === socket.id) {
		waitingPlayer = null;
		return;
	}

	const game = getGameBySocket(socket.id);
	if (!game) return;

	const remaining =
		game.player1.socketId === socket.id
			? game.player2
			: game.player1;

	removeGame(game.roomId);

	// Notify opponent
	io.to(remaining.socketId).emit("match-canceled");
}
