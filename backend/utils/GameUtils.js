import { activeGames, loops, socketToUsername, usernameToSocket, waitingPlayer } from "../store/memory.store.js";
import { GAME_WIDTH, FPS } from "../constants/game.constants.js";
// import { updateGame } from "../services/GameLoop.service.js";
import { GameSession, Paddle } from "../store/game.store.js";
import { randomUUID } from "crypto";

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

	getGameByUsername(username) {
		for (const game of activeGames.values()) {
			if (game.player1.username === username || game.player2.username === username)
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
		socketToUsername.delete(game.player1.socketId);
		socketToUsername.delete(game.player2.socketId);
		usernameToSocket.delete(game.player1.username);
		usernameToSocket.delete(game.player2.username);
	}

	isValidDirection(direction) {
		return direction === "up" || direction === "down";
	}

	isValidPlayerData(data) {
		return ( data && typeof data === "object" &&
			typeof data?.username === "string" &&
			data?.username.length > 0 &&
			typeof data?.firstName === "string" &&
			typeof data?.lastName === "string" &&
			typeof data?.avatar === "string"
		);
	}
}

export const GameUtils = new gameUtils();
