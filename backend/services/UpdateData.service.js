import { isValidPlayerData, getGameByUsername } from "../utils/GameUtils.js"
import { socketToUsername, usernameToSocket, } from "../store/memory.store.js"

export function UpdateData(socket, io, player) {
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