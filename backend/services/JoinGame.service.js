import { activeGames } from "../store/memory.store.js";
import { GameUtils } from "../utils/GameUtils.js";
import { userIdToSocket, socketToUserId } from "../store/memory.store.js";
import { GameSession } from "../store/game.store.js";
import { waitingPlayer } from "../store/memory.store.js";
import { Paddle } from "../store/game.store.js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants/game.constants.js";

class joinGameServices{
	//userIdToSocket
	rebindSocket(id, newSocketId) {
		const oldSocketId = userIdToSocket.get(id);
		if (!oldSocketId || oldSocketId === newSocketId) return;

		socketToUserId.delete(oldSocketId);

		if (waitingPlayer.value?.player.id === id) {
			waitingPlayer.value.socketId = newSocketId;
		}
	}

	createGame(waiting, socket, player) {
		const game = new GameSession();

		if (!game?.roomId) game.roomId = randomUUID();

		Object.assign(game.player1, {
			...waiting.player,
			socketId: waiting.socketId,
			roomId: game.roomId,
			player: new Paddle(40)
		});

		Object.assign(game.player2, {
			...player,
			socketId: socket.id,
			roomId: game.roomId,
			player: new Paddle(GAME_WIDTH - 60)
		});

		game.state = "MATCHED";
		return game;
	}

  startMatch(io, game) {
    io.to(game.player1.socketId).emit("match-found", game.player2);
    io.to(game.player2.socketId).emit("match-found", game.player1);
    
    game.matchTimeOut = setTimeout(() => {
      const current = activeGames.get(game.roomId);
      if (!current || current.state !== "MATCHED") return;
      
      const p1Socket = io.sockets.sockets.get(game.player1.socketId);
      const p2Socket = io.sockets.sockets.get(game.player2.socketId);
      
      if (!p1Socket || !p2Socket) {
        if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
        if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
        GameUtils.cleanupPlayers(game);
        GameUtils.removeGame(game.roomId);
        return;
      }
      
      game.state = "PLAYING";
      
      p1Socket.join(game.roomId);
      p2Socket.join(game.roomId);
      
      io.to(game.roomId).emit("match-started", game.roomId);
      setTimeout(()=> GameUtils.startGameLoop(io, game.roomId), 3000);
      io.to(game.roomId).emit("match-data", game);
    }, 3000);
  }
} 

export const JoinGameServices = new joinGameServices();