import { GameAcceptService } from "../services/gameAccept.service.js";
import { Disconnection } from "../services/Disconnection.service.js"
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { joinGame } from "../services/JoinGame.service.js"
import { onlineUsers} from "../store/memory.store.js"
import { GameInviteService } from "../services/GameInvite.service.js";
import { JoinGameServices } from "../services/JoinGame.service.js";


import { isValidPlayerData, rebindSocket, getGameByUsername } from "../utils/GameUtils.js";
import { waitingPlayer, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js";
import { createGame } from "../utils/GameUtils.js";

import { isValidDirection, getGameBySocket } from "../utils/GameUtils.js"
import { playerMove } from "../store/memory.store.js"
import { PADDLE_SPEED, GAME_HEIGHT, PADDLE_SIZE } from "../constants/game.constants.js"



class ConnectionController 
{
	onJoinGame(socket, io, player) {
		if (!player || !isValidPlayerData(player)) return;
		
		  rebindSocket(player.username, socket.id);
		
		  if (getGameByUsername(player.username)) return;
		  if (socketToUsername.has(socket.id)) return;
		
		  socketToUsername.set(socket.id, player.username);
		  usernameToSocket.set(player.username, socket.id);
		
		  if (!waitingPlayer.value) {
			waitingPlayer.value = { socketId: socket.id, player };
			return;
		  }
		
		  if (waitingPlayer.value.player.username === player.username) return;
		
		  const game = createGame(waitingPlayer.value, socket, player);
		  waitingPlayer.value = null;
		
		  activeGames.set(game.roomId, game);
		  JoinGameServices.startMatch(io, game);
	}
	
	onUpdateData(socket, io, player) {
		if (!player || !isValidPlayerData(player) || !player?.username) return;

		const game = getGameByUsername(player.username);
		if (!game) return;

		const setPlayer = game.player1.username === player.username ? game.player1 : game.player2;

		if (setPlayer.socketId !== socket.id) socketToUsername.delete(setPlayer.socketId);

		setPlayer.socketId = socket.id;
		socketToUsername.set(socket.id, player.username);
		usernameToSocket.set(player.username, socket.id);

		if (game.state === "PLAYING") socket.join(game.roomId);

		io.to(socket.id).emit("match-data", game);
	}
	
	onPaddleMove(socket, io, paddle) {
		if (!paddle || !isValidDirection(paddle.direction)) return;
		
		const now = Date.now()
		const lastMove = playerMove.get(socket.id) || 0;
		if (now - lastMove < 16) return;
		playerMove.set(socket.id, now);
		
		const game = getGameBySocket(socket.id);
		if (!game || game.state !== "PLAYING") return;

		const player = socket.id === game.player1.socketId ? game.player1 : game.player2;
		
		const dy = paddle.direction === "up" ? -PADDLE_SPEED : PADDLE_SPEED;
		player.player.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_SIZE, player.player.y + dy));
		
		io.to(game.roomId).emit("game-state", game);
		// PaddleMove(socket, io, paddle);
	}
	
	onDisconnect(socket, io) {
		console.log("🔻​ Socket Disconnected:", socket.id)
		const socketId = socket.id;

		const username = cleanupSocket(socketId);
		if (!username) return;

		if (handleWaitingPlayerDisconnect(socketId)) return;

		const game = getGameBySocket(socketId);
		if (!game) return;

		handleGameDisconnect(game, socketId, io);
		// Disconnection(socket, io);
	}
	
	onUserOnline(socket, user) {
		console.log("🔻​ User Online:", socket.id)
		onlineUsers.set(user.id, user);
	}

	async onGameInvite(socket, io, data, ack) {
		GameInviteService.onGameInvite(socket, io, data, ack)
	}


	async onGameAccept(socket, io, data, ack) {
		GameAcceptService.onGameAccept(socket, io, data, ack);
	}
}
export const connectionController = new ConnectionController();