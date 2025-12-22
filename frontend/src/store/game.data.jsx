export class paddle {
	constructor() {
		this.x = "";
		this.y = "";
		this.width = "";
		this.height = "";
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
  }
}
