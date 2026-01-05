import { onJoinGame, onDisconnect, onUpdateData, onPaddleMove, onUserOnline
} from "../controllers/connection.controller.js";

export function initSocketManager(io) {
	io.on("connection", socket => {

		console.log("✅​ Socket connected:", socket.id);

		socket.on("join-game", (data) => onJoinGame(socket, io, data));

		socket.on("update-data", (data) => onUpdateData(socket, io, data));

		socket.on("paddle-move", (data) => onPaddleMove(socket, io, data));

		socket.on("disconnect", () => onDisconnect(socket, io));

		socket.on("leave-game", () => onDisconnect(socket, io));

		socket.on("user:online", (data) => onUserOnline(socket, data))
	});
}
