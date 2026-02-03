import { connectionController } from "../controllers/connection.controller.js";
import { onlineUsers } from "../store/memory.store.js"


export function initSocketManager(io) {
  io.on("connection", (socket) => {
    const userId = socket.user?.userId;
    if (userId) socket.join(`user:${userId}`);
		onlineUsers.set(userId, socket.id);

		io.emit("users:status", Array.from(onlineUsers.keys()));

    socket.on("join-game", (data) => connectionController.onJoinGame(socket, io, data));
    socket.on("update-data", (data) => connectionController.onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => connectionController.onPaddleMove(socket, io, data));
    
		socket.on("disconnect", () => {
			// onlineUsers.delete(userId);
			// io.emit("users:status", Array.from(onlineUsers.keys()));
			connectionController.onDisconnect(socket, io);
		});
    
		socket.on("leave-game", () => connectionController.onDisconnect(socket, io));
    socket.on("game:invite", (data, ack) =>connectionController.onGameInvite(socket, io, data, ack));


		socket.on("game:accept", async (data, ack) => {
			connectionController.onGameAccept(socket, io, data, ack);
			ack?.({ ok: true, notification: data });
  	});
	}
)}
