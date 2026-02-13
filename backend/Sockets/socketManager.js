import { connectionController } from "../controllers/connection.controller.js";
import { chatController } from "../controllers/chat.controller.js";
import { onlineUsers } from "../store/memory.store.js";


export function initSocketManager(io) {
  io.on("connection", (socket) => {
		// console.log("​✅​ ❇️ socket connected")
		const userId = socket.user?.userId;
    if (userId) {
			socket.join(`user:${userId}`);
      socket.join(`chat:${userId}`);
    }
		onlineUsers.set(userId, socket.id);
		// console.log("❇️❇️❇️❇️❇️❇️❇️❇️❇️❇️ online users :", userId, onlineUsers.get(userId), onlineUsers.keys());
		
    io.emit("users:status", Array.from(onlineUsers.keys()));

    socket.on("join-game", (data) => connectionController.onJoinGame(socket, io, data));
    socket.on("update-data", (data) => connectionController.onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => connectionController.onPaddleMove(socket, io, data));
    
    socket.on("disconnect", () => {
			// console.log("​🔻 ❇️ socket disconnected")
      connectionController.onDisconnect(socket, io);
    });
    socket.on("leave-game", () => connectionController.onDisconnect(socket, io));
    
    socket.on("game:invite", (data, ack) =>
      connectionController.onGameInvite(socket, io, data, ack)
    );
    socket.on("game:accept", async (data, ack) => {
      connectionController.onGameAccept(socket, io, data, ack);
    });

		socket.on("chat:game:accept", (data, ack)=>{
			console.log("====> this is all data from chat:game:accept:", data);
		})
    socket.on("chat:send", (data) => chatController.sendMessage(socket, io, data));
    socket.on("chat:error", (error) => {
      console.error(error.message);
    });
  });
}
