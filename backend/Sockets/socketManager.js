import { onJoinGame, onDisconnect, onUpdateData, onPaddleMove
} from "../controllers/connection.controller.js";

export function initSocketManager(io) {
	io.on("connection", socket => {

		socket.on("join-game", data => onJoinGame(socket, io, data));

		socket.on("update-data", data => onUpdateData(socket, io, data));

		socket.on("paddle-move", data => onPaddleMove(socket, io, data));

		socket.on("disconnect", () => onDisconnect(socket, io));

		socket.on("leave-game", () => onDisconnect(socket, io));
	});
}
