import { isValidPlayerData, rebindSocket, getGameByUsername, cleanupPlayers, removeGame, startGameLoop } from "../utils/GameUtils.js";
import { waitingPlayer, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js";
import { createGame } from "../utils/GameUtils.js";

function startMatch(io, game) {
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
		// startGameLoop(io, game.roomId);
    io.to(game.roomId).emit("match-data", game);
  }, 3000);
}

export function joinGame(socket, io, player) {
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
  startMatch(io, game);
}
