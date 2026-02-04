import { isValidPlayerData, rebindSocket, getGameByUsername, cleanupPlayers, removeGame, startGameLoop } from "../utils/GameUtils.js";
import { waitingPlayer, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js";
import { createGame } from "../utils/GameUtils.js";


class joinGameServices{
  
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
        cleanupPlayers(game);
        removeGame(game.roomId);
        return;
      }
      
      game.state = "PLAYING";
      
      p1Socket.join(game.roomId);
      p2Socket.join(game.roomId);
      
      io.to(game.roomId).emit("match-started", game.roomId);
      setTimeout(()=> startGameLoop(io, game.roomId), 3000);
      io.to(game.roomId).emit("match-data", game);
    }, 3000);
  }
  
} 

export const JoinGameServices = new joinGameServices();