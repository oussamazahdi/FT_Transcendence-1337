import { activeGames, loops, socketToUserId, userIdToSocket, waitingPlayer } from "../store/memory.store.js";
import { FPS } from "../constants/game.constants.js";
import { GameLoop } from "../services/GameLoop.service.js";

class gameUtils{
	getGame = (roomId) => activeGames.get(roomId);

	 getGameBySocket(socketId) {
		for (const game of activeGames.values()) {
			if (game.player1.socketId === socketId || game.player2.socketId === socketId)
				return game;
		}
		return null;
	}

	getGameByUserId(id) {
		for (const game of activeGames.values()) {
			if (game.player1.id === id || game.player2.id === id)
				return game;
		}
		return null;
	}

	removeGame(roomId) {
		const loop = loops.get(roomId);
		if (loop) clearInterval(loop);

		loops.delete(roomId);
		activeGames.delete(roomId);
	}

	startGameLoop(io, roomId) {
		if (loops.has(roomId)) return;

		const loop = setInterval(() => GameLoop.updateGame(io, roomId), FPS);
		loops.set(roomId, loop);
	}

	cleanupPlayers(game) {
		socketToUserId.delete(game.player1.socketId);
		socketToUserId.delete(game.player2.socketId);
		userIdToSocket.delete(game.player1.id);
		userIdToSocket.delete(game.player2.id);
	}

	isValidDirection(direction) {
		return direction === "up" || direction === "down" || direction === "stop";
	}

	isValidPlayerData(data) {
		return ( data && typeof data === "object" &&
			typeof data?.id === "number" &&
			typeof data?.username === "string" &&
			data?.username.length > 0 &&
			typeof data?.firstName === "string" &&
			typeof data?.lastName === "string" &&
			typeof data?.avatar === "string"
		);
	}
}

export const GameUtils = new gameUtils();
