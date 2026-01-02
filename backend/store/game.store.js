import { randomUUID } from "crypto";

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 700;

/* ================= BALL ================= */
export class Ball {
	constructor() {
		const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
		const speed = 2.5;

		this.x = GAME_WIDTH / 2;
		this.y = GAME_HEIGHT / 2;
		this.radius = 10;
		this.speed = speed;
		this.velocityX = Math.cos(angle) * speed;
		this.velocityY = Math.sin(angle) * speed;
	}
}

/* ================= PADDLE ================= */
export class Paddle {
	constructor(x) {
		this.width = 15;
		this.height = 120;
		this.x = x;
		this.y = (GAME_HEIGHT - this.height) / 2;
	}
}

/* ================= PLAYER ================= */
export class Player {
	constructor() {
		this.socketId = "";
		this.firstName = "";
		this.lastName = "";
		this.username = "";
		this.avatar = "";
		this.score = 0;
		this.roomId = "";
		this.player = null;
		this.ready = false;
	}
}

/* ================= GAME ================= */
export class GameSession {
	constructor() {
		this.state = "WAITING"; // WAITING | PLAYING | FINISHED
		this.gameType = "PingPong";
		this.roomId = randomUUID();
		this.startPlayingAt = 0;
		this.matchTimeOut = 0;
		this.player1 = new Player();
		this.player2 = new Player();
		this.ball = new Ball();
	}
}
