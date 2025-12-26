import { GameSession, Paddle } from "../store/game.store.js";
import { randomUUID } from "crypto";

let waitingPlayer = null;
const activeGames = new Map();
const loops = new Map();

export function getGame(roomId) {
	return activeGames.get(roomId);
}

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

export function createGame(game) {
	activeGames.set(game.roomId, game);
	return game;
}

export function removeGame(roomId) {
	const loop = loops.get(roomId);
	if (loop) clearInterval(loop);

	loops.delete(roomId);
	activeGames.delete(roomId);
}

function updateGame(io, roomId) {
	const game = activeGames.get(roomId);
	if (!game || game.state !== "PLAYING") return;

	if ( game.ball.y - game.ball.radius <= 0 || game.ball.y + game.ball.radius >= 700)
		game.ball.velocityY *= -1;

	if (game.ball.x <= 0 || game.ball.x >= 1024) {
		// if (game.ball.x >= 1024) setScore1((s) => s + 1);
		// if (game.ball.x <= 0) setScore2((s) => s + 1);
		game.ball.x = 512;
		game.ball.y = 350;
	}

	game.ball.x += game.ball.velocityX * game.ball.speed;
	game.ball.y += game.ball.velocityY * game.ball.speed;


	io.to(roomId).emit("game-state", game);
}

export function startGameLoop(io, roomId) {
	if (loops.has(roomId)) return;

	const loop = setInterval(() => {
		updateGame(io, roomId);
	}, 1000 / 25);

	loops.set(roomId, loop);
}


export function handleUpdateData(socket, io, playerData) {
	if (!playerData?.username) return;

	const game = getGameByUsername(playerData.username);
	if (!game) return;

	const player = game.player1.username === playerData.username ? game.player1 : game.player2;

	player.socketId = socket.id;
	socket.join(game.roomId);

	io.to(socket.id).emit("match-data", game);
	console.log("🔄 Reconnected:", player.username);
}


function matchFound(io, socket, playerData) {
	const game = new GameSession();
	game.roomId = randomUUID();

	
	Object.assign(game.player1, {
		...waitingPlayer.playerData,
		socketId: waitingPlayer.socketId,
		roomId: game.roomId,
		player: new Paddle(40),
	});

	Object.assign(game.player2, {
		...playerData,
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

	return game;
}

export function handleJoin(socket, io, playerData) {
	if (!playerData?.username) return;

	const existingGame = getGameByUsername(playerData.username);
	if (existingGame) return;

	if (!waitingPlayer) {
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




export function handleDisconnect(socket, io) {
	console.log("❌ Disconnected:", socket.id);

	if (waitingPlayer?.socketId === socket.id) {
		waitingPlayer = null;
		return;
	}

	const game = getGameBySocket(socket.id);
	if (!game) return;

	// dont forgot to change this
	//  [when one of players leave the the quest check if other
		// player waiting if yes change the first player with econd
		// if not add the other player to waiting player ]
	const remaining = game.player1.socketId === socket.id ? game.player2 : game.player1;

	io.to(remaining.socketId).emit("opponent-left");
	removeGame(game.roomId);
}

const PADDLESIZE = 120;

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
