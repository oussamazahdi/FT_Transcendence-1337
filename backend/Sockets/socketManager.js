import { connectionController } from "../controllers/connection.controller.js";
import { GameSession } from "../store/game.store.js";
import { activeGames, usernameToSocket } from "../store/memory.store.js";
import { createGame, getGameByUsername, isValidPlayerData } from "../utils/GameUtils.js";
import { randomUUID } from "crypto";
import { GAME_WIDTH, FPS } from "../constants/game.constants.js";
import { startGameLoop } from "../utils/GameUtils.js";
import { onlineUsers } from "../store/memory.store.js"




// function startMatch(io, game) {
//   io.to(game.player1.socketId).emit("match-found", game.player2);
//   io.to(game.player2.socketId).emit("match-found", game.player1);

//   game.matchTimeOut = setTimeout(() => {
//     const current = activeGames.get(game.roomId);
//     if (!current || current.state !== "MATCHED") return;

//     const p1Socket = io.sockets.sockets.get(game.player1.socketId);
//     const p2Socket = io.sockets.sockets.get(game.player2.socketId);

//     if (!p1Socket || !p2Socket) {
//       if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
//       if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
//       cleanupPlayers(game);
//       removeGame(game.roomId);
//       return;
//     }

//     game.state = "PLAYING";

//     p1Socket.join(game.roomId);
//     p2Socket.join(game.roomId);

//     io.to(game.roomId).emit("match-started", game.roomId);
// 		setTimeout(()=> startGameLoop(io, game.roomId), 3000);
// 		// startGameLoop(io, game.roomId);
//     io.to(game.roomId).emit("match-data", game);
//   }, 3000);
// }


export async function onGameAccept(socket, io, data, ack) {
	const player1 = data?.player1 || null;
	const player2 = data?.player2 || null;
	const roomId = data?.payload?.roomId || null;

	if (!player1 || !player2 || !roomId) return;
	if (!isValidPlayerData(player1) || !isValidPlayerData(player2)) return;
	if (getGameByUsername(player1?.username) || getGameByUsername(player2?.username)) return;
	if (usernameToSocket.has(player1?.username) || usernameToSocket.has(player2?.username)) return;
	/* we should bined usernames with socket Ids */
	// const game2 = createGame(player1, socket, player2);
	/* implement create game logic */
	const game = new GameSession();
	
	if (!game?.roomId) game.roomId = randomUUID();

	Object.assign(game.player1, {
		... player1, 
		// socketId: socket.id     in this case the socket.id should come with data obj
		roomId: game.roomId, 		// the same thing with
		player: new Paddle(40),
	})

	Object.assign(game.player2, {
		... player2, 
		// socketId: socket.id     in this case the socket.id should come with data obj
		roomId: game.roomId, 		// the same thing with
		player: new Paddle(GAME_WIDTH - 60),
	})

	game.state = "MATCHED";

	activeGames.set(game.roomId, game);

	// io.to(game.player1.socketId).emit("match-accepted", game.player2);
  // io.to(game.player2.socketId).emit("match-accepted", game.player1);


	game.matchTimeOut = setTimeout(() => {
		const current = activeGames.get(game.roomId);
		if (!current || current.state !== "MATCHED") return;
		
		const p1Socket = io.sockets.sockets.get(game.player1.socketId);
		const p2Socket = io.sockets.sockets.get(game.player2.socketId);
		
		if (!p1Socket || !p2Socket) {
			if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
			if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
			cleanupPlayers(game);
		  removeGame(game.roomId);
		  return;
		}
		
		game.state = "PLAYING";

		p1Socket.join(game.roomId);
		p2Socket.join(game.roomId);

		io.to(game.roomId).emit("match-started", game.roomId);
		setTimeout(()=> startGameLoop(io, game.roomId), 3000);
		// startGameLoop(io, game.roomId);
		io.to(game.roomId).emit("match-data", game);
		}, 3000);


	// startMatch(io, game);
}

export function initSocketManager(io) {
  io.on("connection", (socket) => {
    const userId = socket.user?.userId;
    if (userId) socket.join(`user:${userId}`);
		onlineUsers.set(userId, socket.id);
		// console.log("onlineUsers:", onlineUsers);

		io.emit("users:status", Array.from(onlineUsers.keys()));

    socket.on("join-game", (data) => connectionController.onJoinGame(socket, io, data));
    socket.on("update-data", (data) => connectionController.onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => connectionController.onPaddleMove(socket, io, data));
    socket.on("disconnect", () => {
			onlineUsers.delete(userId);
			io.emit("users:status", Array.from(onlineUsers.keys()));
			connectionController.onDisconnect(socket, io);
		});
    socket.on("leave-game", () => connectionController.onDisconnect(socket, io));
    socket.on("game:invite", (data, ack) =>connectionController.onGameInvite(socket, io, data, ack));
		// socket.on("game:accept", (data, ack) => {})
  });
}
