import { games, GameSession } from "../store/game.store.js"

function createFreshSession() {
	return new GameSession();
}

function findGameByusername(username) {
	return games.find(
		game =>
			game.player1.username === username ||
			game.player2.username === username
	);
}

function findGameBySocket(socketId) {
	return games.find(
		game =>
			game.player1.socketId === socketId ||
			game.player2.socketId === socketId
	);
}

function clearSessionIfBroken() {
	if (session.state !== "WAITING") {
		session = createFreshSession();
	}
}

function removeGame(game) {
	games = games.filter(g => g !== game);
}

function handleJoin(socket, io, playerData) {
	const game = findGameByusername(playerData.username);
	if (game) {
		const player = game.player1.username === playerData.username ? game.player1 : game.player2;
	
		const opponent =
			player === game.player1 ? game.player2 : game.player1;
	
		player.socketId = socket.id;
	
		if (game.state === "MATCHED" || game.state === "PLAYING") {
			io.to(socket.id).emit("match-found", opponent);
		}
	
		console.log("🔄 Reconnected / multi-tab join");
		return;
	}


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

		session.state = "PLAYING";
		session.state = "PLAYING";
		
		io.to(session.player1.socketId).emit("start-match", {roomId: session.roomId,});
		io.to(session.player2.socketId).emit("start-match", {roomId: session.roomId,});
		games.push(session);
		session = createFreshSession();
		
	}
}

function handleDisconnect(socket, io) {
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