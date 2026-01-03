import {
	activeGames,
	loops,
	socketToUsername,
	usernameToSocket,
	waitingPlayer
} from "../store/memory.store.js";

import { updateGame } from "../services/GameLoop.service.js";

const FPS = 1000 / 60;

export const getGame = (roomId) => activeGames.get(roomId);

export function getGameBySocket(socketId) {
	for (const game of activeGames.values()) {
		if (
			game.player1.socketId === socketId ||
			game.player2.socketId === socketId
		) {
			return game;
		}
	}
	return null;
}

export function getGameByUsername(username) {
	for (const game of activeGames.values()) {
		if (
			game.player1.username === username ||
			game.player2.username === username
		) {
			return game;
		}
	}
	return null;
}

export function removeGame(roomId) {
	const loop = loops.get(roomId);
	if (loop) clearInterval(loop);

	loops.delete(roomId);
	activeGames.delete(roomId);
}

export function startGameLoop(io, roomId) {
	if (loops.has(roomId)) return;

	const loop = setInterval(() => updateGame(io, roomId), FPS);
	loops.set(roomId, loop);
}

export function rebindSocket(username, newSocketId) {
	const oldSocketId = usernameToSocket.get(username);
	if (!oldSocketId || oldSocketId === newSocketId) return;

	socketToUsername.delete(oldSocketId);

	if (waitingPlayer?.playerData.username === username) {
		waitingPlayer.socketId = newSocketId;
	}
}

export function cleanupPlayers(game) {
	socketToUsername.delete(game.player1.socketId);
	socketToUsername.delete(game.player2.socketId);
	usernameToSocket.delete(game.player1.username);
	usernameToSocket.delete(game.player2.username);
}

export function isValidDirection(direction) {
	return direction === "up" || direction === "down";
}

export function isValidPlayerData(data) {
	return (
		data &&
		typeof data.username === "string" &&
		data.username.length > 0 &&
		data.username.length <= 20 &&
		typeof data.firstName === "string" &&
		typeof data.lastName === "string" &&
		typeof data.avatar === "string"
	);
}
