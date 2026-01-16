import { socketToUsername, usernameToSocket, playerMove, waitingPlayer } from "../store/memory.store.js"
import { getGameBySocket, removeGame } from "../utils/GameUtils.js"
import { WIN_SCORE } from "../constants/game.constants.js";
import { MatchController } from "../controllers/game.controller.js";


const controller = new MatchController();

function cancelMatch(matchTimeOut, socketId, io) {
  clearTimeout(matchTimeOut);
  io.to(socketId).emit("match-canceled");
}

function finishGame(game, remainingPlayer, io) {
  game.state = "FINISHED";
  remainingPlayer.score = WIN_SCORE;
	// store data here
  io.to(game.roomId).emit("game-state", game);
	
	const db = io.db;

	console.log("game:", game);
  const player1Id = game.player1.id;
  const player2Id = game.player2.id;

  const winner =
    game.player1.score > game.player2.score
      ? player1Id
      : player2Id;

  controller.createMatchHistory(db, {
    player1: player1Id,
    player2: player2Id,
    score1: game.player1.score,
    score2: game.player2.score,
    winner,
    status: "forfeit",
  });
}

function handleGameDisconnect(game, socketId, io) {
  const { player1, player2, roomId, state, matchTimeOut } = game;

  const remainingPlayer = socketId === player1.socketId ? player2 : player1;

  if (state === "PLAYING") finishGame(game, remainingPlayer, io);
  else cancelMatch(matchTimeOut, remainingPlayer.socketId, io);

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

