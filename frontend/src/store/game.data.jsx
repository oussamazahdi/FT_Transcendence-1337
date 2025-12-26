import { randomUUID } from "crypto";

export class Ball {
	constructor() {
		this.x = 0; //int
		this.y = 0; //int
		this.velocityX = 2;
		this.velocityY = 2;
		this.speed = 1.5;
		this.radius = 10;
	}
}

export class Paddle {
	constructor(x) {
		this.x = x;
		this.y = 700 / 2 - 160;
		this.width = 15;
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
		this.player = new paddle();
  }
}

export class GameSession {
  constructor() {
    this.state = "WAITING"; // WAITING | MATCHED | PLAYING | FINISHED
		this.gameType = "PingPong";
		this.roomId = randomUUID();
		this.player1 = new Player();
		this.player2 = new Player();
		this.ball = new Ball();
  }
}