import { Disconnection } from "../services/Disconnection.service.js"
import { NotifServices } from "../services/Notification.service.js";
import { httpError } from "../services/Notification.service.js";
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { joinGame } from "../services/JoinGame.service.js"
import { onlineUsers } from "../store/memory.store.js"




export class ConnectionController 
{
	onJoinGame(socket, io, player) {
		console.log("🔸​​ Socket Join Game:", socket.id)
		joinGame(socket, io, player)
	}
	
	onUpdateData(socket, io, player) {
		UpdateData(socket, io, player);
	}
	
	onPaddleMove(socket, io, paddle) {
		PaddleMove(socket, io, paddle);
	}
	
	onDisconnect(socket, io) {
		console.log("🔻​ Socket Disconnected:", socket.id)
		Disconnection(socket, io);
	}
	
	onUserOnline(socket, user) {
		console.log("🔻​ User Online:", socket.id)
		onlineUsers.set(user.id, user);
	}

	async onGameInvite(socket, io, data, ack) {
		try {
			const { user, roomId, gameType } = data ?? {};
			
			if (!user || !roomId || !gameType) {
				throw httpError(400, "user, roomId, gameType are required");
			}
			
			const userId = socket.user?.userId;
			console.log("receve game invite :", data);
			if (!userId) {
				throw httpError(401, "Unauthorized");
			}
			
			if (user === userId) {
				throw httpError(400, "You cannot invite yourself");
			}
			
			const notif = await NotifServices.create(socket.db, {
				senderId: userId,
				receiverId: user,
				type: "game_invite",
				title: "Game invite",
				message: "You received a game invite",
				payload: { roomId, gameType },
			});
			
			io.to(`user:${user}`).emit("notification:new", notif);
			ack?.({ ok: true, notification: notif });
		} catch (error) {
			ack?.({
				ok: false,
				statusCode: error?.statusCode ?? 500,
				message: error?.message ?? "Internal server error",
			});
		}
	}

	// async onGameAccept(socket, io, data, ack) {
	// 	try{

	// 		ack?.({ ok: true, notification: notif });
	// 	} catch(error) {
	// 	}
	// }


	async onGameAccept(socket, io, data, ack) {
		try{
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
			ack?.({ ok: true, notification: notif });
		} catch(err) {
		
		}
	}
	
}


export const connectionController = new ConnectionController();
