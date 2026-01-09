import {onJoinGame, onDisconnect, onUpdateData, onPaddleMove, onUserOnline,
} from "../controllers/connection.controller.js";

import { httpError } from "../services/Notification.service.js";
import { NotifServices } from "../services/Notification.service.js";

const service = new NotifServices();

export async function onGameInvite(socket, io, data, ack) {
  try {
    const { toUserId, roomId, gameType } = data ?? {};

    if (!toUserId || !roomId || !gameType) {
      throw httpError(400, "toUserId, roomId, gameType are required");
    }

    const userId = socket.user?.id;
    if (!userId) {
      throw httpError(401, "Unauthorized");
    }

    if (toUserId === userId) {
      throw httpError(400, "You cannot invite yourself");
    }

    const notif = await service.create(socket.db, {
      senderId: userId,
      receiverId: toUserId,
      type: "game_invite",
      title: "Game invite",
      message: "You received a game invite",
      payload: { roomId, gameType },
    });

    io.to(`user:${toUserId}`).emit("notification:new", notif);

    ack?.({ ok: true, notification: notif });
  } catch (error) {
    ack?.({
      ok: false,
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Internal server error",
    });
  }
}

export function initSocketManager(io) {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    const userId = socket.user?.id;
    if (userId) socket.join(`user:${userId}`);

    socket.on("join-game", (data) => onJoinGame(socket, io, data));
    socket.on("update-data", (data) => onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => onPaddleMove(socket, io, data));

    socket.on("disconnect", () => onDisconnect(socket, io));
    socket.on("leave-game", () => onDisconnect(socket, io));

    socket.on("user:online", (data) => onUserOnline(socket, data));

    socket.on("game:invite", (data, ack) => onGameInvite(socket, io, data, ack));
  });
}
