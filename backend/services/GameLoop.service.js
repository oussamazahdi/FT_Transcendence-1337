import { activeGames } from "../store/memory.store.js"
import {
	GAME_HEIGHT,
	GAME_WIDTH,
	PADDLE_SIZE,
	PADDLE_SPEED,
	WIN_SCORE,
	BALL_BASE_SPEED,
	BALL_HIT_SPEED_INCREMENT,
} from "../constants/game.constants.js"
import { GameUtils } from "../utils/GameUtils.js";
import { MatchController } from "../controllers/game.controller.js";

class gameLoop{
	updatePaddles(game, deltaSec) {
		const move = (player) => {
			if (!player?.player) return;
			const direction = Number(player.moveDirection) || 0;
			if (direction === 0) return;

			const nextY = player.player.y + direction * PADDLE_SPEED * deltaSec;
			player.player.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_SIZE, nextY));
		};

		move(game.player1);
		move(game.player2);
	}

	resetBall(ball) {
		ball.x = GAME_WIDTH / 2;
		ball.y = GAME_HEIGHT / 2;
		ball.velocityX *= -1;
		ball.speed = BALL_BASE_SPEED;
	}

	handlePaddleCollision(ball, paddle, isLeft) {
		const hit = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height &&
			(isLeft ? ball.x - ball.radius <= paddle.x + paddle.width && ball.x > paddle.x
				: ball.x + ball.radius >= paddle.x && ball.x < paddle.x + paddle.width);
	
		if (!hit) return;
	
		ball.speed += BALL_HIT_SPEED_INCREMENT;
		ball.velocityX = isLeft ? Math.abs(ball.velocityX) : -Math.abs(ball.velocityX);
	
		ball.velocityY = ((ball.y - paddle.y) / paddle.height - 0.5) * 2;
	}

	updateBall(game) {
		const { ball } = game;
		const p1 = game.player1.player;
		const p2 = game.player2.player;
	
		if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= GAME_HEIGHT) {
			ball.velocityY *= -1;
		}
	
		this.handlePaddleCollision(ball, p1, true);
		this.handlePaddleCollision(ball, p2, false);
	
		ball.x += ball.velocityX * ball.speed;
		ball.y += ball.velocityY * ball.speed;
	
		if (ball.x <= 0 || ball.x >= GAME_WIDTH) {
			if (ball.x <= 0) game.player2.score++;
			else game.player1.score++;
	
			this.resetBall(ball);
		}
	}

	checkScore = (game, io, roomId) => {
		if (game.player1.score < 0 || game.player2.score < 0) {
			game.player1.score = 0;
			game.player2.score = 0;
		}
		if ( game.player1.score < WIN_SCORE && game.player2.score < WIN_SCORE)
			return;
		
		if (game.state !== "PLAYING")
			return;
	
		game.state = "FINISHED";
		io.to(roomId).emit("game-state", game);
	
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
			status: "win",});
	
		MatchController.updateUserXpAndLevel(db, { userId: winner, status: "winner" });
		MatchController.updateUserXpAndLevel(db, { userId: loser, status: "loser" });

		GameUtils.cleanupPlayers(game);
		GameUtils.removeGame(roomId);
	}

	updateGame(io, roomId) {
		const game = activeGames.get(roomId);
		if (!game || game.state !== "PLAYING") return;

		const now = Date.now();
		const previous = game.lastUpdateAt || now;
		const deltaSec = Math.min(Math.max((now - previous) / 1000, 0), 0.05);
		game.lastUpdateAt = now;
	
		this.updatePaddles(game, deltaSec);
		this.updateBall(game);
		this.checkScore(game, io, roomId);
	
		io.to(roomId).emit("game-state", game);
	}

}

export const GameLoop = new gameLoop();
