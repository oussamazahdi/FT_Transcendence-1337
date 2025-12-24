import { randomUUID } from "crypto";

export class Ball {
	constructor() {
		this.x = 300;
		this.y = 200;
		this.velocityX = 0.5;
		this.velocityY = 0.5;
		this.speed = 1.5;
		this.radius = 10;
	}
}

export class Paddle {
	constructor(x) {
		this.x = x;
		this.y = 150;
		this.width = 10;
		this.height = 80;
	}
}

export class Player {
	constructor() {
		this.socketId = "";
		this.firstName = "";
		this.lastName = "";
		this.username = "";
		this.avatar = "";
		this.score = 0;
		this.roomId = "";
		this.paddle = null;
	}
}

export class GameSession {
	constructor() {
		this.state = "WAITING"; // WAITING | PLAYING | FINISHED
		this.gameType = "PingPong";
		this.roomId = randomUUID();
		this.player1 = new Player();
		this.player2 = new Player();
		this.ball = new Ball();
	}
}
