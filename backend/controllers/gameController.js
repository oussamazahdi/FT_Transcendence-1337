import { GameSession, Paddle } from "../store/game.store.js";

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

	game.ball.x += game.ball.velocityX;
	game.ball.y += game.ball.velocityY;

	io.to(roomId).emit("game-state", game);
}

export function startGameLoop(io, roomId) {
	if (loops.has(roomId)) return;

	const loop = setInterval(() => {
		updateGame(io, roomId);
	}, 1000 / 60);

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

	Object.assign(game.player1, {
		...waitingPlayer.playerData,
		socketId: waitingPlayer.socketId,
		roomId: game.roomId,
		player: new Paddle(20),
	});

	Object.assign(game.player2, {
		...playerData,
		socketId: socket.id,
		roomId: game.roomId,
		player: new Paddle(1004),
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
