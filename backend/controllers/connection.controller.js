import { waitingPlayer, socketToUserId, userIdToSocket, activeGames, playerMove, onlineUsers } from "../store/memory.store.js";
import { PADDLE_SPEED, GAME_HEIGHT, PADDLE_SIZE } from "../constants/game.constants.js"
import { NotifServices, httpError } from "../services/Notification.service.js";
import { GameAcceptService } from "../services/gameAccept.service.js";
import { JoinGameServices } from "../services/JoinGame.service.js";
import { GameUtils } from "../utils/GameUtils.js";
import { DisconnectionService } from "../services/Disconnection.service.js";

class ConnectionController 
{
	onJoinGame(socket, io, player) {
		
		console.log("*********************> join game:", player);
		if (!player || !GameUtils.isValidPlayerData(player)) return;
		
		JoinGameServices.rebindSocket(player.id, socket.id);
		
		if (GameUtils.getGameByUserId(player.id)) return;
		if (socketToUserId.has(socket.id)) return;
		
		socketToUserId.set(socket.id, player.id);
		userIdToSocket.set(player.id, socket.id);
		
		if (!waitingPlayer.value) {
			waitingPlayer.value = { socketId: socket.id, player };
			// console.log("**********************> Waiting player:", waitingPlayer.value);
			return;
		}
		
		if (waitingPlayer.value.player.id === player.id) return;
		
		const game = JoinGameServices.createGame(waitingPlayer.value, socket, player);
		waitingPlayer.value = null;
		waitingPlayer.data = null;
		
		activeGames.set(game.roomId, game);
		JoinGameServices.startMatch(io, game);
	}
	
	onUpdateData(socket, io, player) {
		if (!player || !GameUtils.isValidPlayerData(player) || !player?.id) return;

		const game = GameUtils.getGameByUserId(player.id);
		if (!game) return;

		const setPlayer = game.player1.id === player.id ? game.player1 : game.player2;

		if (setPlayer.socketId !== socket.id) socketToUserId.delete(setPlayer.socketId);

		setPlayer.socketId = socket.id;
		socketToUserId.set(socket.id, player.id);
		userIdToSocket.set(player.id, socket.id);

		if (game.state === "PLAYING") socket.join(game.roomId);

		io.to(socket.id).emit("match-data", game);
	}
	
	onPaddleMove(socket, io, paddle) {
		if (!paddle || !GameUtils.isValidDirection(paddle.direction)) return;
		
		const now = Date.now()
		const lastMove = playerMove.get(socket.id) || 0;
		if (now - lastMove < 16) return;
		playerMove.set(socket.id, now);
		
		const game = GameUtils.getGameBySocket(socket.id);
		if (!game || game.state !== "PLAYING") return;

		const player = socket.id === game.player1.socketId ? game.player1 : game.player2;
		
		const dy = paddle.direction === "up" ? -PADDLE_SPEED : PADDLE_SPEED;
		player.player.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_SIZE, player.player.y + dy));
		
		io.to(game.roomId).emit("game-state", game);
	}
	
	onDisconnect(socket, io) {
		const socketId = socket.id;
		const userId = socket.user.userId;

		onlineUsers.delete(userId);
			setTimeout(() => {
				if(!onlineUsers.has(userId)) io.emit("users:status", Array.from(onlineUsers.keys()));
		}, 2000);

		const username = DisconnectionService.cleanupSocket(socketId);
		if (!username) return;

		if (DisconnectionService.handleWaitingPlayerDisconnect(socketId)) return;

		const game = GameUtils.getGameBySocket(socketId);
		if (!game) return;

		DisconnectionService.handleGameDisconnect(game, socketId, io);
	}

	async onGameInvite(socket, io, data, ack) {
		try {
			const { user, roomId, gameType } = data ?? {};
			
			if (!user || !roomId || !gameType)
				throw httpError(400, "user, roomId, gameType are required");
			
			const userId = socket.user?.userId;
			if (!userId)
				throw httpError(401, "Unauthorized");
			if (user === userId)
				throw httpError(400, "You cannot invite yourself");
			
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


	async onGameAccept(socket, io, data, ack) {

		let bindInfo = null;
		
		try{
			const validation = await GameAcceptService.loadAndValidateData(data, io);
			if (!validation.ok) throw new Error(validation?.message);
			const { roomId, notification, db } = validation;
			
			const authorization = GameAcceptService.authorizeReceiver(socket, notification);
			if (!authorization.ok) throw new Error(authorization?.message);
			const {receiverId, senderId} = authorization;
			
			const playersData = await GameAcceptService.loadPlayersData(db, senderId, receiverId, io);
			if (!playersData?.ok)
			{
				// console.log(playersData)
				throw new Error(playersData?.message);
			} 
			const {player1, player2, p1SocketId, p2SocketId, p1Socket, p2Socket} = playersData
			
			bindInfo = { player1, player2, p1SocketId, p2SocketId };
			GameAcceptService.bindUserToSocket(bindInfo);
			
			const GameInfo = { roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 };
			const { result, current } = GameAcceptService.createGameSession(GameInfo);
			if (!result.ok){
				GameAcceptService.cleanupGame(current)
				if (bindInfo) GameAcceptService.unbindUsernameSocketMaps(bindInfo);
				throw new Error(result?.message);
			}

			current.state = "PLAYING";

			p1Socket.join(current.roomId);
    	p2Socket.join(current.roomId);

			io.to(current.roomId).emit("match-started:accept", current.roomId);
			setTimeout(()=> GameUtils.startGameLoop(io, current.roomId), 3000);
			// setTimeout(()=> io.to(current.roomId).emit("match-data", current), 1000);
			io.to(current.roomId).emit("match-data", current);

			ack?.({ ok: true, notification: notification, message: "Success" });
		} catch(err) {
				ack?.({ ok: false, notification: null , message: err?.message });
		}
	}
}
export const connectionController = new ConnectionController();