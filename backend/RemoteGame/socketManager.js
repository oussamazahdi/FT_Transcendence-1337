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

function createRoomId(){
	const roomId = `room_${Date.now()}`
	session.roomId = roomId;
	session.player1.roomId = roomId;
	session.player2.roomId = roomId;
}

export default function initSocketManager(io){
	io.on("connection", (socket)=>{
		console.log("✅ New user connected:", socket.id);
		
		/********************************************************************************************/
		socket.on("join-game", (playerData) => {
			
			if (!session.complete && !session.player1.socketId) {
				Object.assign(session.player1, {
					firstName: playerData.firstName,
					lastName: playerData.lastName,
					login: playerData.login,
					avatar: playerData.avatar,
					socketId: socket.id,
				});
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
				createRoomId();
				// session.complete = true;

				// io.to(session.player1.socketId).emit("match-found", session.player2);
				// io.to(session.player2.socketId).emit("match-found", session.player1);

				// games.push(session);
				// session = new GameSession();
			}
		});
/********************************************************************************************/
		socket.on("disconnect", () => {
			console.log("❌ User disconnected:", socket.id);
		});
/********************************************************************************************/
	})
}
