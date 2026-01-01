import { GameSession, Paddle } from "../store/game.store.js";
import { randomUUID } from "crypto";

/*****************************************************************************/
const PADDLESIZE = 120;
let waitingPlayer = null;

const loops = new Map();
const activeGames = new Map();
const joinedSockets = new Set();
const joinedUsernames = new Set();

/*****************************************************************************/
export function getGame(roomId) {
	return activeGames.get(roomId);
}

export function removeGame(roomId) {
	const loop = loops.get(roomId);
	if (loop) clearInterval(loop);

	loops.delete(roomId);
	activeGames.delete(roomId);
}

/*****************************************************************************/
export function getGameBySocket(socketId) {
	for (const game of activeGames.values()) {
		if (game.player1.socketId === socketId || game.player2.socketId === socketId)
			return game;
	}
	return null;
}

export function getGameByUsername(username) {
	for (const game of activeGames.values()) {
		if (game.player1.username === username || game.player2.username === username)
			return game;
	}
	return null;
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
	if (!waitingPlayer) return;

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
	activeGames.set(game.roomId, game);

	io.to(game.player1.socketId)?.emit("match-found", game.player2);
	io.to(game.player2.socketId)?.emit("match-found", game.player1);

	setTimeout(() => {
		const checkGame = activeGames.get(game.roomId);
		if (!checkGame || checkGame.state !== "MATCHED") return;

		game.state = "PLAYING";
		io.sockets.sockets.get(game.player1.socketId)?.join(game.roomId);
		io.sockets.sockets.get(game.player2.socketId)?.join(game.roomId);

		io.to(game.roomId).emit("match-started", game.roomId);
		startGameLoop(io, game.roomId);
		io.to(game.roomId).emit("match-data", game);
	}, 3000);

	waitingPlayer = null;
	return game;
}

/*****************************************************************************/
export function handleJoin(socket, io, playerData) {
	if (!playerData?.username) return;

	if (joinedSockets.has(socket.id) || joinedUsernames.has(playerData.username)) return;

	if (getGameByUsername(playerData.username)) return;

	joinedSockets.add(socket.id);
	joinedUsernames.add(playerData.username);

	if (!waitingPlayer) {
		waitingPlayer = { socketId: socket.id, playerData };
		return;
	}

	if (waitingPlayer.playerData.username === playerData.username) return;

	const game = matchFound(io, socket, playerData);
	if (!game) return;
}

/*****************************************************************************/
function updateGame(io, roomId) {
	const game = activeGames.get(roomId);
	if (!game || game.state !== "PLAYING") return;

	const ball = game.ball;
	const player1 = game.player1.player;
	const player2 = game.player2.player;

	if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= 700) ball.velocityY *= -1;

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

	ball.x += ball.velocityX * ball.speed;
	ball.y += ball.velocityY * ball.speed;

	if (ball.x <= 0 || ball.x >= 1024) {
		if (ball.x <= 0) game.player2.score++;
		else game.player1.score++;

		ball.x = 512;
		ball.y = 350;
		ball.velocityX *= -1;
		ball.speed = 2.5;
	}

	if (game.player1.score === 10 || game.player2.score === 10) {
		game.state = "FINISHED";
		io.to(roomId).emit("game-state", game);
		removeGame(game.roomId);

		joinedSockets.delete(game.player1.socketId);
		joinedSockets.delete(game.player2.socketId);
		joinedUsernames.delete(game.player1.username);
		joinedUsernames.delete(game.player2.username);
		return;
	}

	io.to(roomId).emit("game-state", game);
}

/*****************************************************************************/
export function handleUpdateData(socket, io, playerData) {
	if (!playerData?.username) return;

	const game = getGameByUsername(playerData.username);
	if (!game) return;

	const player = game.player1.username === playerData.username ? game.player1 : game.player2;

	player.socketId = socket.id;
	if (game.state === "PLAYING") socket.join(game.roomId);

	io.to(socket.id).emit("match-data", game);
}

/*****************************************************************************/
export function handlePaddleMove(socket, io, paddle) {
	const game = getGameBySocket(socket.id);
	if (!game || game.state !== "PLAYING") return;

	const player = socket.id === game.player1.socketId ? game.player1 : game.player2;

	if (paddle.direction === "up") player.player.y = Math.max(0, player.player.y - 14);
	else player.player.y = Math.min(700 - PADDLESIZE, player.player.y + 14);

	io.to(game.roomId).emit("game-state", game);
}

export function handleDisconnect(socket, io) {
	console.log("❌ Disconnected:", socket.id);

	joinedSockets.delete(socket.id);

	if (waitingPlayer?.socketId === socket.id) {
		joinedUsernames.delete(waitingPlayer.playerData.username);
		waitingPlayer = null;
		return;
	}

	const game = getGameBySocket(socket.id);
	if (!game) return;

	joinedUsernames.delete(game.player1.username);
	joinedUsernames.delete(game.player2.username);

	if (game.state === "PLAYING") {
		game.state = "FINISHED";
	
		const winner = socket.id === game.player1.socketId ? game.player2 : game.player1;
		winner.score = 10;
	
		io.to(game.roomId).emit("game-state", game);
		removeGame(game.roomId);
	
		joinedSockets.delete(game.player1.socketId);
		joinedSockets.delete(game.player2.socketId);
	
	} else if (game.state === "MATCHED") {
		// game.canceled = true;
		const remaining = socket.id === game.player1.socketId ? game.player2: game.player1;
		io.to(remaining.socketId).emit("match-canceled");
		removeGame(game.roomId);
	}
}

