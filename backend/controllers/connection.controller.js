import { Disconnection } from "../services/Disconnection.service.js"
import { NotifServices } from "../services/Notification.service.js";
import { httpError } from "../services/Notification.service.js";
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { joinGame } from "../services/JoinGame.service.js"
import { onlineUsers } from "../store/memory.store.js"


const service = new NotifServices();


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
			
			const notif = await service.create(socket.db, {
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

}


export const connectionController = new ConnectionController();
