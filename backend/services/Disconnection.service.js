import { socketToUsername, usernameToSocket, playerMove, waitingPlayer } from "../store/memory.store.js"
import { getGameBySocket, removeGame } from "../utils/GameUtils.js"
import { WIN_SCORE } from "../constants/game.constants.js";

export function Disconnection (socket, io) {
	const username = socketToUsername.get(socket.id);
	if (username) usernameToSocket.delete(username);

	socketToUsername.delete(socket.id);
	playerMove.delete(socket.id);

	if (waitingPlayer?.socketId === socket.id) {
		waitingPlayer = null;
		return;
	}

	const game = getGameBySocket(socket.id);
	if (!game) return;

	const p1 = game.player1;
	const p2 = game.player2;
	const remaining = socket.id === p1.socketId ? p2 : p1;
	
	if (game.state === "PLAYING") {
		game.state = "FINISHED";
		remaining.score = WIN_SCORE;
		io.to(game.roomId).emit("game-state", game);
	} else {
		clearTimeout(game.matchTimeOut);
		io.to(remaining.socketId).emit("match-canceled");
	}
	removeGame(game.roomId);
}
