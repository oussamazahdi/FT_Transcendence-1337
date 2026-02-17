import { socketToUserId, userIdToSocket, waitingPlayer } from "../store/memory.store.js"
import { GameUtils } from "../utils/GameUtils.js";
import { WIN_SCORE } from "../constants/game.constants.js";
import { MatchController } from "../controllers/game.controller.js";


class disconnectionService{

  cancelMatch(matchTimeOut, socketId, io) {
    clearTimeout(matchTimeOut);
    io.to(socketId).emit("match-canceled");
  }
  
  finishGame(game, remainingPlayer, io) {
    game.state = "FINISHED";
    remainingPlayer.score = WIN_SCORE;
    io.to(game.roomId).emit("game-state", game);
    
    const db = io.db;

    const player1Id = game.player1.id;
    const player2Id = game.player2.id;
    
    const winner = game.player1.score > game.player2.score ? player1Id : player2Id;
    const loser = winner == player1Id ? player2Id : player1Id;
    
		MatchController.createMatchHistory(db, {
      player1: player1Id,
      player2: player2Id,
      score1: game.player1.score,
      score2: game.player2.score,
      winner,
      status: "forfait",
    });
    MatchController.updateUserXpAndLevel(db, { userId: winner, status: "winner" });
    MatchController.updateUserXpAndLevel(db, { userId: loser, status: "loser" });
  }

  handleGameDisconnect(game, socketId, io) {
    const { player1, player2, roomId, state, matchTimeOut } = game;
    
    const remainingPlayer = socketId === player1.socketId ? player2 : player1;
    
    if (state === "PLAYING") this.finishGame(game, remainingPlayer, io);
    else this.cancelMatch(matchTimeOut, remainingPlayer.socketId, io);
    
    GameUtils.removeGame(roomId);
  }

  handleWaitingPlayerDisconnect(socketId) {
    if (waitingPlayer.value?.socketId !== socketId) return false;
    
    waitingPlayer.value = null;
    waitingPlayer.data = null;
    return true;
  }

  cleanupSocket(socketId) {
    const id = socketToUserId.get(socketId);
    if (!id) return null;
    
    socketToUserId.delete(socketId);
    userIdToSocket.delete(id);
    
    return id;
  }
}

export const DisconnectionService = new disconnectionService();
