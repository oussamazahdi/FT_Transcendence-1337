import { isValidDirection, getGameBySocket } from "../utils/GameUtils.js"
import { playerMove } from "../store/memory.store.js"
import { PADDLE_SPEED, GAME_HEIGHT, PADDLE_SIZE } from "../constants/game.constants.js"

export function PaddleMove(socket, io, paddle) {
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
}