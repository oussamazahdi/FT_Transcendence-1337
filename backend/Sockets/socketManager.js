import { connectionController } from "../controllers/connection.controller.js";
import { chatController } from "../controllers/chat.controller.js";
import { httpError } from "../services/Notification.service.js";
import { NotifServices } from "../services/Notification.service.js";

const service = new NotifServices();

export function initSocketManager(io) {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    const userId = socket.user?.userId;
    if (userId){
      socket.join(`user:${userId}`);
      socket.join(`chat:${userId}`);
    } 

    socket.on("join-game", (data) => connectionController.onJoinGame(socket, io, data));
    socket.on("update-data", (data) => connectionController.onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => connectionController.onPaddleMove(socket, io, data));
    socket.on("disconnect", () => connectionController.onDisconnect(socket, io));
    socket.on("leave-game", () => connectionController.onDisconnect(socket, io));
    socket.on("user:online", (data) => connectionController.onUserOnline(socket, data));
    socket.on("game:invite", (data, ack) => connectionController.onGameInvite(socket, io, data, ack));
    // chat 
    socket.on("chat:send", (data) => chatController.sendMessage(socket, io, data));
    socket.on("chat:error", (error) => {
      console.error(error.message);
    })
  });
}
