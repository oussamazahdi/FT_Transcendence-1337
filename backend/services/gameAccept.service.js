import { onlineUsers, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js";
import { NotifServices } from "../services/Notification.service.js";
import { GameSession, Paddle } from "../store/game.store.js";
import { GAME_WIDTH } from "../constants/game.constants.js";
import { getGameByUsername } from "../utils/GameUtils.js";
import { startGameLoop } from "../utils/GameUtils.js";
import { userModels } from "../models/user.model.js";
import { randomUUID } from "crypto";


class gameAcceptService {
  playerIsValid(data) {
		console.log("data:", data)
		return ( data && typeof data === "object" &&
			typeof data.username === "string" &&
			data.username.length > 0 &&
			data.username.length <= 20 &&
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
	
			if (getGameByUsername(player1.username) || getGameByUsername(player2.username))
				return { ok: false, message: "One of the players is already in a game 1" };
	
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
			console.error("[loadPlayersData] real error:", err);
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
			usernameToSocket.set(player1.username, p1SocketId);
			usernameToSocket.set(player2.username, p2SocketId);
			socketToUsername.set(p1SocketId, player1.username);
			socketToUsername.set(p2SocketId, player2.username);
	}
	
	unbindUsernameSocketMaps = ({ player1, player2, p1SocketId, p2SocketId })=> {
		if (player1?.username) usernameToSocket.delete(player1.username);
		if (player2?.username) usernameToSocket.delete(player2.username);
		if (p1SocketId) socketToUsername.delete(p1SocketId);
		if (p2SocketId) socketToUsername.delete(p2SocketId);
	}
	
	cleanupGame(game) {
		try {
			if (!game) return;
			activeGames?.delete?.(game.roomId);
		} catch (_) {}
	}

	async onGameAccept(socket, io, data, ack){
		let bindInfo = null;
		
		try{
			const validation = await this.loadAndValidateData(data, io);
			if (!validation.ok) throw new Error(validation?.message);
			const { roomId, notification, db } = validation;
			
			const authorization = this.authorizeReceiver(socket, notification);
			if (!authorization.ok) throw new Error(authorization?.message);
			const {receiverId, senderId} = authorization;
			
			const playersData = await this.loadPlayersData(db, senderId, receiverId, io);
			if (!playersData?.ok)
				{
					console.log(playersData)
					throw new Error(playersData?.message);
				} 
			const {player1, player2, p1SocketId, p2SocketId, p1Socket, p2Socket} = playersData
			
			bindInfo = { player1, player2, p1SocketId, p2SocketId };
			this.bindUserToSocket(bindInfo);
			
			const GameInfo = { roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 };
			const { result, current } = this.createGameSession(GameInfo);
			if (!result.ok){
				cleanupGame(current)
				if (bindInfo) this.unbindUsernameSocketMaps(bindInfo);
				throw new Error(result?.message);
			}

			current.state = "PLAYING";

			p1Socket.join(current.roomId);
    	p2Socket.join(current.roomId);

			io.to(current.roomId).emit("match-started:accept", current.roomId);
			setTimeout(()=> startGameLoop(io, current.roomId), 3000);
			io.to(current.roomId).emit("match-data", current);

			ack?.({ ok: true, notification: notification, message: "Success" });
		} catch(err) {
				ack?.({ ok: false, notification: null , message: err?.message });
		}
	}
}

export const GameAcceptService = new gameAcceptService();
