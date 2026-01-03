import { activeGames } from "../store/memory.store.js"
import { GAME_HEIGHT, GAME_WIDTH, WIN_SCORE } from "../constants/game.constants.js"
import { removeGame, cleanupPlayers } from "../utils/GameUtils.js"


export function updateGame(io, roomId) {
	const game = activeGames.get(roomId);
	if (!game || game.state !== "PLAYING") return;

	updateBall(game);
	checkScore(game, io, roomId);

	io.to(roomId).emit("game-state", game);
}

export function updateBall(game) {
	const { ball } = game;
	const p1 = game.player1.player;
	const p2 = game.player2.player;

	if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= GAME_HEIGHT) {
		ball.velocityY *= -1;
	}

	handlePaddleCollision(ball, p1, true);
	handlePaddleCollision(ball, p2, false);

	ball.x += ball.velocityX * ball.speed;
	ball.y += ball.velocityY * ball.speed;

	if (ball.x <= 0 || ball.x >= GAME_WIDTH) {
		if (ball.x <= 0) game.player2.score++;
		else game.player1.score++;

		resetBall(ball);
	}
}

export function handlePaddleCollision(ball, paddle, isLeft) {
	// TODO: create a clean draw to explain it to corrector
	const hit = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height &&
		(isLeft ? ball.x - ball.radius <= paddle.x + paddle.width && ball.x > paddle.x
			: ball.x + ball.radius >= paddle.x && ball.x < paddle.x + paddle.width);

	if (!hit) return;

	ball.speed += 0.3;
	ball.velocityX = isLeft ? Math.abs(ball.velocityX) : -Math.abs(ball.velocityX);

	ball.velocityY = ((ball.y - paddle.y) / paddle.height - 0.5) * 2;
}

export function resetBall(ball) {
	ball.x = GAME_WIDTH / 2;
	ball.y = GAME_HEIGHT / 2;
	ball.velocityX *= -1;
	ball.speed = 2.5;
}

export function checkScore(game, io, roomId) {
	if (game.player1.score < 0 || game.player2.score < 0) {
		console.error(`❌ Invalid scores detected: ${game.player1.score} - ${game.player2.score}`);
		game.player1.score = 0;
		game.player2.score = 0;
	}
	if ( game.player1.score < WIN_SCORE && game.player2.score < WIN_SCORE)
		return;

	if (game.state !== "PLAYING")
		return;

	game.state = "FINISHED";
	io.to(roomId).emit("game-state", game);

	cleanupPlayers(game);
	removeGame(roomId);
}