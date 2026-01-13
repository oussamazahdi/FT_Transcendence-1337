import { socketToUsername, usernameToSocket, playerMove, waitingPlayer } from "../store/memory.store.js"
import { getGameBySocket, removeGame } from "../utils/GameUtils.js"
import { WIN_SCORE } from "../constants/game.constants.js";

function cancelMatch(matchTimeOut, socketId, io) {
  clearTimeout(matchTimeOut);
  io.to(socketId).emit("match-canceled");
}

function finishGame(game, remainingPlayer, io) {
  game.state = "FINISHED";
  remainingPlayer.score = WIN_SCORE;
  io.to(game.roomId).emit("game-state", game);
}

function handleGameDisconnect(game, socketId, io) {
  const { player1, player2, roomId, state, matchTimeOut } = game;

  const remainingPlayer =
    socketId === player1.socketId ? player2 : player1;

  if (state === "PLAYING") {
    finishGame(game, remainingPlayer, io);
  } else {
    cancelMatch(matchTimeOut, remainingPlayer.socketId, io);
  }

  removeGame(roomId);
}

function handleWaitingPlayerDisconnect(socketId) {
  if (waitingPlayer.value?.socketId !== socketId) return false;

  waitingPlayer.value = null;
  return true;
}

function cleanupSocket(socketId) {
  const username = socketToUsername.get(socketId);
  if (!username) return null;

  socketToUsername.delete(socketId);
  usernameToSocket.delete(username);
  playerMove.delete(socketId);

  return username;
}

export function Disconnection(socket, io) {
  const socketId = socket.id;

  const username = cleanupSocket(socketId);
  if (!username) return;

  if (handleWaitingPlayerDisconnect(socketId)) return;

  const game = getGameBySocket(socketId);
  if (!game) return;

  handleGameDisconnect(game, socketId, io);
}

