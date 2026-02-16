import { onlineUsers, socketToUserId, userIdToSocket, activeGames } from "../store/memory.store.js";
import { NotifServices } from "../services/Notification.service.js";
import { GameSession, Paddle } from "../store/game.store.js";
import { GAME_WIDTH } from "../constants/game.constants.js";
import { GameUtils } from "../utils/GameUtils.js";
import { userModels } from "../models/user.model.js";
import { randomUUID } from "crypto";


class gameAcceptService {
  playerIsValid(data) {
		return ( data && typeof data === "object" &&
			typeof data.username === "string" &&
			data.username.length > 0 &&
			typeof data.firstname === "string" &&
			typeof data.lastname === "string" &&
			typeof data.avatar === "string"
		);
	}
	
	loadAndValidateData = async (data, io) => {
	
		if (!data || typeof data !== "object") return {ok:false, message:"Invalid payload"};
		
		const notifId = Number(data?.notifId);
		if (!Number.isInteger(notifId) || notifId <= 0) return {ok:false, message:"Invalid notifId"};
		
		const db = io?.db;
		if (!db) return {ok:false, message:"DB not attached to io"};
		
		const notification = await NotifServices.getById(db, notifId);
		if (!notification || typeof notification !== "object") { return {ok:false, message:"Notification not found"}}
		if (notification.type !== "game_invite") { return {ok:false, message:"Notification type is not game_invite"}}
		if (notification.is_expired) { return {ok:false, message:"Notification expired"}; }
		
		const roomId = notification?.payload?.roomId ? notification.payload.roomId : randomUUID();
	
		return { ok: true, roomId, notification, db };
	}
	
	authorizeReceiver = (socket, notification)=>{
		const receiverId = Number(notification.receiver_id);
		const senderId = Number(notification.sender_id);
	
		
		if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) { return {ok:false, message:"Notification has invalid sender/receiver"} }
		
		const socketUserId = Number(socket?.user?.userId);
		
		if (!Number.isInteger(socketUserId)) return {ok:false, message:"Unauthenticated"};
		if (socketUserId !== receiverId) return {ok:false, message:"Forbidden: not notification receiver" }
		
		return ({ok:true, receiverId, senderId, message: "Success"});
	}


	loadPlayersData = async (db, senderId, receiverId, io) => {
		try {
			const player1 = await userModels.getUserById(db, senderId);
			const player2 = await userModels.getUserById(db, receiverId);
	
			if (!this.playerIsValid(player1) || !this.playerIsValid(player2))
				return { ok: false, message: "Invalid player data" };
	
			if (GameUtils.getGameByUserId(player1.id) || GameUtils.getGameByUserId(player2.id))
				return { ok: false, message: "One of the players is already in a game" };
	
			const p1SocketId = onlineUsers?.get?.(senderId);
			const p2SocketId = onlineUsers?.get?.(receiverId);
	
			if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string")
				return { ok: false, message: "One of the players is offline" };
	
			const p1Socket = io.sockets.sockets.get(p1SocketId);
			const p2Socket = io.sockets.sockets.get(p2SocketId);
	
			if (!p1Socket || !p2Socket)
				return { ok: false, message: "Player socket missing" };
	
			return { ok: true, player1, player2, p1SocketId, p2SocketId, p1Socket, p2Socket, message: "Success" };
		} catch (err) {
			return { ok: false, message: err?.message ?? "Unexpected error while loading players data" };
		}
	};
	
	
	createGameSession = ({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 })=>{
		const game = new GameSession();
		game.roomId = roomId;
	
		Object.assign(game.player1, {
			id: senderId,
			socketId: p1SocketId,
			firstName: player1.firstname,
			lastName: player1.lastname,
			username: player1.username,
			avatar: player1.avatar,
			roomId,
			player: new Paddle(40),
		});
	
		Object.assign(game.player2, {
			id: receiverId,
			socketId: p2SocketId,
			firstName: player2.firstname,
			lastName: player2.lastname,
			username: player2.username,
			avatar: player2.avatar,
			roomId,
			player: new Paddle(GAME_WIDTH - 60),
		});
	
		game.state = "MATCHED";
	
		activeGames.set(game.roomId, game);
		const current = activeGames.get(game.roomId);
		if (!current || current.state !== "MATCHED") {
			activeGames.delete(game.roomId);
			return { result:{ok:false, message:"Failed to create match"}, current};
		}
	
		return {result:{ok:true, message: "Success"}, current};
	}
	
	bindUserToSocket = ({ player1, player2, p1SocketId, p2SocketId })=>{
			if(!player1 || !player2) return;
			userIdToSocket.set(player1.id, p1SocketId);
			userIdToSocket.set(player2.id, p2SocketId);
			socketToUserId.set(p1SocketId, player1.id);
			socketToUserId.set(p2SocketId, player2.id);
	}
	
	unbindUsernameSocketMaps = ({ player1, player2, p1SocketId, p2SocketId })=> {
		if (player1?.id) userIdToSocket.delete(player1.id);
		if (player2?.id) userIdToSocket.delete(player2.id);
		if (p1SocketId) socketToUserId.delete(p1SocketId);
		if (p2SocketId) socketToUserId.delete(p2SocketId);
	}
	
	cleanupGame(game) {
		try {
			if (!game) return;
			activeGames?.delete?.(game.roomId);
		} catch (_) {}
	}
}

export const GameAcceptService = new gameAcceptService();
