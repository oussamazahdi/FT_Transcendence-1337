import { NotifServices } from "../services/Notification.service.js";
import { httpError } from "../services/Notification.service.js";

class gameInvite{
	async onGameInvite(socket, io, data, ack) {
		try {
			const { user, roomId, gameType } = data ?? {};
			
			if (!user || !roomId || !gameType) {
				throw httpError(400, "user, roomId, gameType are required");
			}
			
			const userId = socket.user?.userId;
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
}

export const GameInviteService = new gameInvite();