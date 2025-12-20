import { games, GameSession } from "../store/game.store.js"

let session = createFreshSession();

export function createFreshSession() {
	return new GameSession();
}

export function findGameByusername(username) {
	return games.find( (game) => game.player1.username === username || game.player2.username === username );
}

export function findGameBySocket(socketId) {
	return games.find( (game) => game.player1.socketId === socketId || game.player2.socketId === socketId );
}

export function clearSessionIfBroken() {
	if (session.state !== "WAITING") {
		session = createFreshSession();
	}
}

export function removeGame(game) {
	const index = games.indexOf(game);
	if (index !== -1) {
		games.splice(index, 1);
	}
}


export function handleUpdateData(socket, io, playerData) {
	if (!playerData?.username) return;

	const game = findGameByusername(playerData.username);
	if (!game) return;

	const player = game.player1.username === playerData.username ? game.player1 : game.player2;

	player.socketId = socket.id;

	socket.join(game.roomId);

	io.to(socket.id).emit("match-data", game);

	console.log("🔄 Player reconnected:", player.username);
}



export function handleJoin(socket, io, playerData) {
	if (session.player1.username === playerData.username) {
		session.player1.socketId = socket.id;
		return;
	}


	if (!session.player1.socketId) {
		Object.assign(session.player1, {
			...playerData,
			socketId: socket.id,
			roomId: session.roomId,
		});
		session.state = "WAITING";
		return;
	}


	if (!session.player2.socketId) {
		Object.assign(session.player2, {
			...playerData,
			socketId: socket.id,
			roomId: session.roomId,
		});

		session.state = "MATCHED";
		io.to(session.player1.socketId).emit("match-found", session.player2);
		io.to(session.player2.socketId).emit("match-found", session.player1);

		io.sockets.sockets.get(session.player1.socketId)?.join(session.roomId);
		io.sockets.sockets.get(session.player2.socketId)?.join(session.roomId);

		io.to(session.roomId).emit("match-data", session);
		games.push(session);
		session = createFreshSession();
	}
}

export function handleDisconnect(socket, io) {
	console.log("❌ Disconnected:", socket.id);

	if (session.player1.socketId === socket.id) {
		console.log("🧹 Waiting player left");
		session = createFreshSession();
		return;
	}

	const game = findGameBySocket(socket.id);
	if (!game) return;
	const leaver = game.player1.socketId === socket.id ? game.player1 : game.player2;
	const remaining = leaver === game.player1 ? game.player2 : game.player1;

	if (game.state === "MATCHED") {
		io.to(remaining.socketId).emit("match-canceled");
		removeGame(game);
		return;
	}

	if (game.state === "PLAYING") {
		io.to(remaining.socketId).emit("opponent-left");
		game.state = "FINISHED";
		removeGame(game);
	}
}