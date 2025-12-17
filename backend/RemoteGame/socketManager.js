import { randomUUID } from "crypto";

class Player {
	constructor() {
		this.socketId = "";
		this.firstName = "";
		this.lastName = "";
		this.username = "";
		this.avatar = "";
		this.score = 0;
		this.roomId = "";
	}
}

class GameSession {
	constructor() {
		this.state = "WAITING"; // WAITING | MATCHED | PLAYING | FINISHED
		this.gameType = "PingPong";
		this.roomId = randomUUID();
		this.player1 = new Player();
		this.player2 = new Player();
	}
}


let games = [];
let session = createFreshSession();

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
	// 1️⃣ Already in a game → reconnect
	const game = findGameByusername(playerData.username);
	if (game) {
		const player = game.player1.username === playerData.username ? game.player1 : game.player2;
	
		const opponent =
			player === game.player1 ? game.player2 : game.player1;
	
		// update socket
		player.socketId = socket.id;
	
		// 🔥 VERY IMPORTANT PART
		if (game.state === "MATCHED" || game.state === "PLAYING") {
			io.to(socket.id).emit("match-found", opponent);
		}
	
		console.log("🔄 Reconnected / multi-tab join");
		return;
	}

	// 2️⃣ Already waiting → update socket
	if (session.player1.username === playerData.username) {
		session.player1.socketId = socket.id;
		return;
	}

	// 3️⃣ No one waiting → player1
	if (!session.player1.socketId) {
		Object.assign(session.player1, {
			...playerData,
			socketId: socket.id,
			roomId: session.roomId,
		});
		session.state = "WAITING";
		return;
	}

	// 4️⃣ Player2 joins → MATCHED
	if (!session.player2.socketId) {
		Object.assign(session.player2, {
			...playerData,
			socketId: socket.id,
			roomId: session.roomId,
		});

		session.state = "MATCHED";

		io.to(session.player1.socketId).emit("match-found", session.player2);
		io.to(session.player2.socketId).emit("match-found", session.player1);
		// setTimeout(()=>{
		// 	io.to(session.player1.socketId).emit("start-match");
		// 	io.to(session.player2.socketId).emit("start-match");
		// 	games.push(session);
		// 	session = createFreshSession(); // ✅ NO LEAK
		// }, 3000);
		

		// setTimeout(() => {
			session.state = "PLAYING";
			session.state = "PLAYING";
			
			io.to(session.player1.socketId).emit("start-match", {
				roomId: session.roomId,
			});
			
			io.to(session.player2.socketId).emit("start-match", {
				roomId: session.roomId,
			});
			games.push(session);
			session = createFreshSession(); // ✅ NO LEAK
		// }, 3000);
		
	}
}



function handleDisconnect(socket, io) {
	console.log("❌ Disconnected:", socket.id);

	/* ---------- WAITING SESSION ---------- */
	if (session.player1.socketId === socket.id) {
		console.log("🧹 Waiting player left");
		session = createFreshSession();
		return;
	}

	/* ---------- ACTIVE GAMES ---------- */
	const game = findGameBySocket(socket.id);
	if (!game) return;
	const leaver = game.player1.socketId === socket.id ? game.player1 : game.player2;
	const remaining = leaver === game.player1 ? game.player2 : game.player1;

	// MATCHED (before start)
	if (game.state === "MATCHED") {
		io.to(remaining.socketId).emit("match-canceled");
		removeGame(game);
		return;
	}

	// PLAYING → FORFEIT
	if (game.state === "PLAYING") {
		io.to(remaining.socketId).emit("opponent-left");
		game.state = "FINISHED";
		removeGame(game);
	}
}


export default function initSocketManager(io) {
	io.on("connection", socket => {
		console.log("✅ Connected:", socket.id);

		socket.on("join-game", playerData => {
			handleJoin(socket, io, playerData);
		});

		socket.on("disconnect", () => {
			handleDisconnect(socket, io);
		});
	});
}





























// class Player {
// 	constructor() {
// 		this.socketId = "";
// 		this.firstName = "";
// 		this.lastName = "";
// 		this.username = "";
// 		this.avatar = "";
// 		this.score = 0;
// 		this.roomId = "";
// 	}
// }

// function findGameByusername(username) {
// 	return games.find(
// 		game =>
// 			game.player1.username === username ||
// 			game.player2.username === username
// 	);
// }

// function isInWaitingSession(username) {
// 	return (
// 		session.player1.username === username ||
// 		session.player2.username === username
// 	);
// }

// function findGameBySocket(socketId) {
// 	return games.find(
// 		game =>
// 			game.player1.socketId === socketId ||
// 			game.player2.socketId === socketId
// 	);
// }

// function removeGame(gameToRemove) {
// 	games = games.filter(game => game !== gameToRemove);
// }



// class GameSession  {
// 	constructor(){
// 		this.complete = false;
// 		this.gameType = "PingPong";
// 		this.roomId = "";
// 		this.player1 = new Player();
// 		this.player2 = new Player();
// 	}
// };

// let games = [];
// let session = new GameSession;

// function createRoomId(){
// 	const roomId = `room_${Date.now()}`
// 	session.roomId = roomId;
// 	session.player1.roomId = roomId;
// 	session.player2.roomId = roomId;
// }

// export default function initSocketManager(io){
// 	io.on("connection", (socket)=>{
// 		console.log("✅ New user connected:", socket.id);

// 		// socket.on("join-game", (playerData) => {
// 		// 	const roomId = `room_${Date.now()}`
// 		// 	const alreadyInGame = games.some(game => {
// 		// 		console.log("game.player1.username:", game.player1.username);
// 		// 		console.log("game.player2.username:", game.player2.username);
// 		// 		console.log("playerData.username:", playerData.username);
// 		// 		return (
// 		// 			game.player1.username === playerData.username ||
// 		// 			game.player2.username === playerData.username
// 		// 		);
// 		// 	});
// 		// 	console.log("alreadyInGame:", alreadyInGame)
// 		// 	if (alreadyInGame) return;
			
// 		// 	if (!session.complete && !session.player1.socketId) {
// 		// 		Object.assign(session.player1, {
// 		// 			firstName: playerData.firstName,
// 		// 			lastName: playerData.lastName,
// 		// 			username: playerData.username,
// 		// 			avatar: playerData.avatar,
// 		// 			socketId: socket.id,
// 		// 			roomId: roomId,
// 		// 		});
// 		// 		return;
// 		// 	}
// 		// 	if (!session.complete && session.player2.socketId === "") {
// 		// 		Object.assign(session.player2, {
// 		// 			firstName: playerData.firstName,
// 		// 			lastName: playerData.lastName,
// 		// 			username: playerData.username,
// 		// 			avatar: playerData.avatar,
// 		// 			socketId: socket.id,
// 		// 			roomId: session.player1.roomId,
// 		// 		});
// 		// 		// createRoomId();
// 		// 		session.complete = true;
				
// 		// 		io.to(session.player1.socketId).emit("match-found", session.player2);
// 		// 		io.to(session.player2.socketId).emit("match-found", session.player1);
				
// 		// 		games.push(session);
// 		// 		session = new GameSession();
// 		// 	}
// 		// });


// 		// socket.on("join-game", (playerData) => {
// 		// 	const roomId = `room_${Date.now()}`;
		
// 		// 	const alreadyInGame = games.some((game) =>
// 		// 			game.player1.username === playerData.username ||
// 		// 			game.player2.username === playerData.username
// 		// 		) ||
// 		// 		session.player1.username === playerData.username ||
// 		// 		session.player2.username === playerData.username;
		
// 		// 	console.log("alreadyInGame:", alreadyInGame);

			
// 		// 	if (alreadyInGame) {
// 		// 		const gameFound = games.find(game =>
// 		// 			game.player1.username === playerData.username ||
// 		// 			game.player2.username === playerData.username
// 		// 		);
				
// 		// 		const sessionFound =
// 		// 			session.player1.username === playerData.username ||
// 		// 			session.player2.username === playerData.username
// 		// 				? session
// 		// 				: null;
				
// 		// 		const gameSession = gameFound || sessionFound;
				
// 		// 		if (gameSession) {
// 		// 			if (gameSession.player1.username === playerData.username)
// 		// 				gameSession.player1.socketId = socket.id;
// 		// 			else
// 		// 				gameSession.player2.socketId = socket.id;
// 		// 		}
// 		// 		console.log("⛔ User already in a game:", playerData.username);
// 		// 		return;
// 		// 	}



		
// 		// 	if (!session.complete && !session.player1.socketId) {
// 		// 		Object.assign(session.player1, {
// 		// 			firstName: playerData.firstName,
// 		// 			lastName: playerData.lastName,
// 		// 			username: playerData.username,
// 		// 			avatar: playerData.avatar,
// 		// 			socketId: socket.id,
// 		// 			roomId,
// 		// 		});
// 		// 		return;
// 		// 	}
		
// 		// 	if (!session.complete && session.player2.socketId === "") {
// 		// 		Object.assign(session.player2, {
// 		// 			firstName: playerData.firstName,
// 		// 			lastName: playerData.lastName,
// 		// 			username: playerData.username,
// 		// 			avatar: playerData.avatar,
// 		// 			socketId: socket.id,
// 		// 			roomId: session.player1.roomId,
// 		// 		});
		
// 		// 		session.complete = true;
		
// 		// 		io.to(session.player1.socketId).emit("match-found", session.player2);
// 		// 		io.to(session.player2.socketId).emit("match-found", session.player1);
		
// 		// 		games.push(session);
// 		// 		session = new GameSession();
// 		// 	}
// 		// 	console.log("all games:", games)
// 		// });




// 		socket.on("join-game", (playerData) => {
// 			console.log("🎮 join-game:", playerData.username);
		
// 			/* --------------------------------------------------
// 				 1️⃣ Player already in a MATCH (games[])
// 			-------------------------------------------------- */
// 			const gameFound = findGameByusername(playerData.username);
// 			if (gameFound) {
// 				if (gameFound.player1.username === playerData.username)
// 					gameFound.player1.socketId = socket.id;
// 				else
// 					gameFound.player2.socketId = socket.id;
		
// 				console.log("🔄 Reconnected to existing game");
// 				return;
// 			}
		
// 			/* --------------------------------------------------
// 				 2️⃣ Player already WAITING (session)
// 			-------------------------------------------------- */
// 			if (isInWaitingSession(playerData.username)) {
// 				if (session.player1.username === playerData.username)
// 					session.player1.socketId = socket.id;
// 				else
// 					session.player2.socketId = socket.id;
		
// 				console.log("⏳ Player already waiting, socket updated");
// 				return;
// 			}
		
// 			/* --------------------------------------------------
// 				 3️⃣ No one waiting → become PLAYER 1
// 			-------------------------------------------------- */
// 			if (!session.player1.socketId) {
// 				const roomId = `room_${Date.now()}`;
		
// 				Object.assign(session.player1, {
// 					firstName: playerData.firstName,
// 					lastName: playerData.lastName,
// 					username: playerData.username,
// 					avatar: playerData.avatar,
// 					socketId: socket.id,
// 					roomId,
// 				});
		
// 				console.log("🧍 Player 1 waiting");
// 				return;
// 			}
		
// 			/* --------------------------------------------------
// 				 4️⃣ PLAYER 2 joins → MATCH FOUND
// 			-------------------------------------------------- */
// 			if (!session.player2.socketId) {
// 				Object.assign(session.player2, {
// 					firstName: playerData.firstName,
// 					lastName: playerData.lastName,
// 					username: playerData.username,
// 					avatar: playerData.avatar,
// 					socketId: socket.id,
// 					roomId: session.player1.roomId,
// 				});
		
// 				session.complete = true;
		
// 				io.to(session.player1.socketId).emit(
// 					"match-found",
// 					session.player2
// 				);
// 				io.to(session.player2.socketId).emit(
// 					"match-found",
// 					session.player1
// 				);
		
// 				games.push(session);
// 				session = new GameSession();
		
// 				console.log("🔥 Match found");
// 			}
// 		});
		
		

// 		socket.on("disconnect", () => {
// 			console.log("❌ User disconnected:", socket.id);
		
// 			/* --------------------------------------------------
// 				 1️⃣ DISCONNECT WHILE WAITING (SESSION)
// 			-------------------------------------------------- */
		
// 			// Player1 waiting alone
// 			if (
// 				session.player1.socketId === socket.id &&
// 				!session.complete
// 			) {
// 				console.log("🧹 Player1 left while waiting");
// 				session = new GameSession();
// 				return;
// 			}
		
// 			// Player2 disconnected before match completes (rare but possible)
// 			if (
// 				session.player2.socketId === socket.id &&
// 				!session.complete
// 			) {
// 				console.log("🧹 Player2 left before match complete");
// 				session.player2 = new Player();
// 				return;
// 			}
		
// 			/* --------------------------------------------------
// 				 2️⃣ DISCONNECT AFTER MATCH FOUND (games[])
// 			-------------------------------------------------- */
		
// 			const game = findGameBySocket(socket.id);
// 			if (!game) return;
		
// 			const isPlayer1 = game.player1.socketId === socket.id;
// 			const leaver = isPlayer1 ? game.player1 : game.player2;
// 			const remaining = isPlayer1 ? game.player2 : game.player1;
		
// 			console.log("⚠️ Player left a matched game:", leaver.username);
		
// 			/* --------------------------------------------------
// 				 2️⃣a BEFORE GAME STARTED
// 			-------------------------------------------------- */
// 			if (!game.started) {
// 				console.log("🛑 Match canceled (before start)");
		
// 				// Notify remaining player
// 				if (remaining.socketId) {
// 					io.to(remaining.socketId).emit("match-canceled");
// 				}
		
// 				removeGame(game);
		
// 				// OPTIONAL: put remaining player back into waiting session
// 				session = new GameSession();
// 				Object.assign(session.player1, remaining);
		
// 				return;
// 			}
		
// 			/* --------------------------------------------------
// 				 2️⃣b DURING GAME (FORFEIT)
// 			-------------------------------------------------- */
// 			console.log("🏆 Game ended by forfeit");
		
// 			game.complete = true;
		
// 			if (remaining.socketId) {
// 				io.to(remaining.socketId).emit("opponent-left", {
// 					winner: true,
// 				});
// 			}
		
// 			removeGame(game);
// 		});
		
// 	})
// }
