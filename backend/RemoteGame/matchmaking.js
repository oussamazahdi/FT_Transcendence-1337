class Player {
	constructor() {
		this.socketId = "";
		this.firstName = "";
		this.lastName = "";
		this.login = "";
		this.avatar = "";
		this.score = 0;
		this.roomId = "";
	}
}

class GameSession  {
	constructor(){
		this.complete = false;
		this.gameType = "PingPong";
		this.roomId = "";
		this.player1 = new Player();
		this.player2 = new Player();
	}
};

let games = [];
let session = new GameSession;

export function handleConnection(socket) {

	console.log("✅ New user connected:", socket.id);
	// if (socket.id === session.player1.socketId || socket.id === session.player2.socketId)
	// 	return;
	socket.on("join-game", (playerData) => {
		
		console.log("============> player", playerData);
		
		if (!session.complete && !session.player1.socketId) {
			Object.assign(session.player1, {
				firstName: playerData.firstName,
        lastName: playerData.lastName,
        login: playerData.login,
        avatar: playerData.avatar,
        socketId: socket.id,
      });
			// console.log("============> session", session);
			
      return;
    }

    if (!session.complete && session.player2.socketId === "") {
      Object.assign(session.player2, {
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        login: playerData.login,
        avatar: playerData.avatar,
        socketId: socket.id,
      });

      session.complete = true;

      io.to(session.player1.socketId).emit("match-found", session.player2);
      io.to(session.player2.socketId).emit("match-found", session.player1);

      games.push(session);
      session = new GameSession();
    }
  });
}