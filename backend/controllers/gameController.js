

import { GameSession, Paddle } from "../store/game.store.js";
import { randomUUID } from "crypto";

/*------------------------------------------------------------------------------------------ Consts*/
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 700;
const PADDLE_SIZE = 120;
const PADDLE_SPEED = 15
const FPS = 1000 / 60;
const WIN_SCORE = 10;

/*------------------------------------------------------------------------------------------ Store*/
let waitingPlayer = null;

const loops = new Map();
const playerMove = new Map();
const activeGames = new Map();
const socketToUsername = new Map();
const usernameToSocket = new Map();

/*------------------------------------------------------------------------------------------ Geters*/
export const getGame = (roomId) => activeGames.get(roomId);

export function getGameBySocket(socketId) {
	for (const game of activeGames.values()) {
		if (
			game.player1.socketId === socketId ||
			game.player2.socketId === socketId
		) {
			return game;
		}
	}
	return null;
}

export function getGameByUsername(username) {
	for (const game of activeGames.values()) {
		if (
			game.player1.username === username ||
			game.player2.username === username
		) {
			return game;
		}
	}
	return null;
}

/*------------------------------------------------------------------------------------------ Game loop (create, remove)*/
export function removeGame(roomId) {
	const loop = loops.get(roomId);
	if (loop) clearInterval(loop);
	
	loops.delete(roomId);
	activeGames.delete(roomId);
}

export function startGameLoop(io, roomId) {
	if (loops.has(roomId)) return;
	
	const loop = setInterval(() => updateGame(io, roomId), FPS);
	loops.set(roomId, loop);
}

/*------------------------------------------------------------------------------------------ Matchmaking*/
function createGame(waiting, socket, playerData) {
	const game = new GameSession();
	game.roomId = randomUUID();

	Object.assign(game.player1, { ...waiting.playerData,
		socketId: waiting.socketId,
		roomId: game.roomId,
		player: new Paddle(40),
	});

	Object.assign(game.player2, { ...playerData,
		socketId: socket.id,
		roomId: game.roomId,
		player: new Paddle(GAME_WIDTH - 60),
	});

	game.state = "MATCHED";
	return game;
}

function startMatch(io, game) {
	io.to(game.player1.socketId).emit("match-found", game.player2);
	io.to(game.player2.socketId).emit("match-found", game.player1);

	game.matchTimeOut = setTimeout(() => {
		const current = activeGames.get(game.roomId);
		if (!current || current.state !== "MATCHED") return;

		const p1Socket = io.sockets.sockets.get(game.player1.socketId);
		const p2Socket = io.sockets.sockets.get(game.player2.socketId);
		if (!p1Socket || !p2Socket) {
			if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
			if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
			cleanupPlayers(game);
			removeGame(game);
			return ;
		}

		game.state = "PLAYING";

		io.sockets.sockets.get(game.player1.socketId)?.join(game.roomId);
		io.sockets.sockets.get(game.player2.socketId)?.join(game.roomId);

		io.to(game.roomId).emit("match-started", game.roomId);
		startGameLoop(io, game.roomId);
		io.to(game.roomId).emit("match-data", game);
	}, 3000);
}

export function handleJoin(socket, io, playerData) {
	if (!isValidPlayerData(playerData)) return console.warn(`⚠️ Invalid player data from ${socket.id}`);

	if (!playerData?.username) return;

	rebindSocket(playerData.username, socket.id);

	if (getGameByUsername(playerData.username)) return;
	if (socketToUsername.has(socket.id)) return;

	socketToUsername.set(socket.id, playerData.username);
	usernameToSocket.set(playerData.username, socket.id);

	if (!waitingPlayer) {
		waitingPlayer = { socketId: socket.id, playerData };
		return;
	}

	if (waitingPlayer.playerData.username === playerData.username) return;

	const game = createGame(waitingPlayer, socket, playerData);
	waitingPlayer = null;

	activeGames.set(game.roomId, game);
	startMatch(io, game);
}

/*------------------------------------------------------------------------------------------ Update Game */
function updateGame(io, roomId) {
	const game = activeGames.get(roomId);
	if (!game || game.state !== "PLAYING") return;

	updateBall(game);
	checkScore(game, io, roomId);

	io.to(roomId).emit("game-state", game);
}

function updateBall(game) {
	const { ball } = game;
	const p1 = game.player1.player;
	const p2 = game.player2.player;

	if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= GAME_HEIGHT) {
		ball.velocityY *= -1;
	}

	handlePaddleCollision(ball, p1, true);
	handlePaddleCollision(ball, p2, false);

	ball.x += ball.velocityX * ball.speed;
	ball.y += ball.velocityY * ball.speed;

	if (ball.x <= 0 || ball.x >= GAME_WIDTH) {
		if (ball.x <= 0) game.player2.score++;
		else game.player1.score++;

		resetBall(ball);
	}
}

function handlePaddleCollision(ball, paddle, isLeft) {
	// TODO: create a clean draw to explain it to corrector
	const hit = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height &&
		(isLeft ? ball.x - ball.radius <= paddle.x + paddle.width && ball.x > paddle.x
			: ball.x + ball.radius >= paddle.x && ball.x < paddle.x + paddle.width);

	if (!hit) return;

	ball.speed += 0.3;
	ball.velocityX = isLeft ? Math.abs(ball.velocityX) : -Math.abs(ball.velocityX);

	ball.velocityY = ((ball.y - paddle.y) / paddle.height - 0.5) * 2;
}

function resetBall(ball) {
	ball.x = GAME_WIDTH / 2;
	ball.y = GAME_HEIGHT / 2;
	ball.velocityX *= -1;
	ball.speed = 2.5;
}

function checkScore(game, io, roomId) {
	if (game.player1.score < 0 || game.player2.score < 0) {
		console.error(`❌ Invalid scores detected: ${game.player1.score} - ${game.player2.score}`);
		game.player1.score = 0;
		game.player2.score = 0;
	}
	if ( game.player1.score < WIN_SCORE && game.player2.score < WIN_SCORE)
		return;

	if (game.state !== "PLAYING")
		return;

	game.state = "FINISHED";
	io.to(roomId).emit("game-state", game);

	cleanupPlayers(game);
	removeGame(roomId);
}

/*------------------------------------------------------------------------------------------ player asyn */
export function handleUpdateData(socket, io, playerData) {
	if (!playerData?.username) return;

	const game = getGameByUsername(playerData.username);
	if (!game) return;

	const player = game.player1.username === playerData.username ? game.player1 : game.player2;

	if (player.socketId !== socket.id) socketToUsername.delete(player.socketId);

	player.socketId = socket.id;
	socketToUsername.set(socket.id, playerData.username);
	usernameToSocket.set(playerData.username, socket.id);

	if (game.state === "PLAYING") socket.join(game.roomId);

	io.to(socket.id).emit("match-data", game);
}

/*------------------------------------------------------------------------------------------ Update paddles */
export function handlePaddleMove(socket, io, paddle) {
	
	if (!paddle || !isValidDirection(paddle.direction)) return;

	const now = Date.now()
	const lastMove = playerMove.get(socket.id) || 0;
	if (now - lastMove < 16) return;
	playerMove.set(socket.id, now);
	
	const game = getGameBySocket(socket.id);
	if (!game || game.state !== "PLAYING") return;

	const player = socket.id === game.player1.socketId ? game.player1 : game.player2;

	const dy = paddle.direction === "up" ? -PADDLE_SPEED : PADDLE_SPEED;
	player.player.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_SIZE, player.player.y + dy));

	io.to(game.roomId).emit("game-state", game);
}

/*------------------------------------------------------------------------------------------ Player Disconnection */
export function handleDisconnect(socket, io) {
	const username = socketToUsername.get(socket.id);
	if (username) usernameToSocket.delete(username);
	
	socketToUsername.delete(socket.id);
	playerMove.delete(socket.id);

	if (waitingPlayer?.socketId === socket.id) {
		waitingPlayer = null;
		return;
	}

	const game = getGameBySocket(socket.id);
	if (!game) return;
	
	const p1 = game.player1;
	const p2 = game.player2;
	const remaining = socket.id === p1.socketId ? p2 : p1;

	if (game.state === "PLAYING") {
		game.state = "FINISHED";
		remaining.score = WIN_SCORE;
		io.to(game.roomId).emit("game-state", game);
	} else {
		clearTimeout(game.matchTimeOut);
		io.to(remaining.socketId).emit("match-canceled");
	}
	removeGame(game.roomId);
}

/*------------------------------------------------------------------------------------------ Utils */
function rebindSocket(username, newSocketId) {
	const oldSocketId = usernameToSocket.get(username);
	if (!oldSocketId || oldSocketId === newSocketId) return;

	socketToUsername.delete(oldSocketId);

	if (waitingPlayer?.playerData.username === username) {
		waitingPlayer.socketId = newSocketId;
	}
}

function cleanupPlayers(game) {
	socketToUsername.delete(game.player1.socketId);
	socketToUsername.delete(game.player2.socketId);
	usernameToSocket.delete(game.player1.username);
	usernameToSocket.delete(game.player2.username);
}

function isValidDirection(direction) {
	return direction === "up" || direction === "down";
}

function isValidPlayerData(data) {
	return data && typeof data.username === "string" && data.username.length > 0
		&& data.username.length <= 20 && typeof data.firstName === "string"
			&& typeof data.lastName === "string" && typeof data.avatar === "string";
}
