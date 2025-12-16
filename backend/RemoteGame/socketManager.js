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

		// socket.on("join-game", (playerData) => {
		// 	const roomId = `room_${Date.now()}`
		// 	const alreadyInGame = games.some(game => {
		// 		console.log("game.player1.login:", game.player1.login);
		// 		console.log("game.player2.login:", game.player2.login);
		// 		console.log("playerData.login:", playerData.login);
		// 		return (
		// 			game.player1.login === playerData.login ||
		// 			game.player2.login === playerData.login
		// 		);
		// 	});
		// 	console.log("alreadyInGame:", alreadyInGame)
		// 	if (alreadyInGame) return;
			
		// 	if (!session.complete && !session.player1.socketId) {
		// 		Object.assign(session.player1, {
		// 			firstName: playerData.firstName,
		// 			lastName: playerData.lastName,
		// 			login: playerData.login,
		// 			avatar: playerData.avatar,
		// 			socketId: socket.id,
		// 			roomId: roomId,
		// 		});
		// 		return;
		// 	}
		// 	if (!session.complete && session.player2.socketId === "") {
		// 		Object.assign(session.player2, {
		// 			firstName: playerData.firstName,
		// 			lastName: playerData.lastName,
		// 			login: playerData.login,
		// 			avatar: playerData.avatar,
		// 			socketId: socket.id,
		// 			roomId: session.player1.roomId,
		// 		});
		// 		// createRoomId();
		// 		session.complete = true;
				
		// 		io.to(session.player1.socketId).emit("match-found", session.player2);
		// 		io.to(session.player2.socketId).emit("match-found", session.player1);
				
		// 		games.push(session);
		// 		session = new GameSession();
		// 	}
		// });


		socket.on("join-game", (playerData) => {
			const roomId = `room_${Date.now()}`;
		
			const alreadyInGame = games.some((game) =>
					game.player1.login === playerData.login ||
					game.player2.login === playerData.login
				) ||
				session.player1.login === playerData.login ||
				session.player2.login === playerData.login;
		
			console.log("alreadyInGame:", alreadyInGame);

			
			if (alreadyInGame) {
				const gameFound = games.find(game =>
					game.player1.login === playerData.login ||
					game.player2.login === playerData.login
				);
				
				const sessionFound =
					session.player1.login === playerData.login ||
					session.player2.login === playerData.login
						? session
						: null;
				
				const gameSession = gameFound || sessionFound;
				
				if (gameSession) {
					if (gameSession.player1.login === playerData.login)
						gameSession.player1.socketId = socket.id;
					else
						gameSession.player2.socketId = socket.id;
					// console.log("⛔ User already in a game:", playerData.login);
					// console.log("**GameSession:", gameSession);
				}
				console.log("⛔ User already in a game:", playerData.login);
				return;
			}



		
			if (!session.complete && !session.player1.socketId) {
				Object.assign(session.player1, {
					firstName: playerData.firstName,
					lastName: playerData.lastName,
					login: playerData.login,
					avatar: playerData.avatar,
					socketId: socket.id,
					roomId,
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
					roomId: session.player1.roomId,
				});
		
				session.complete = true;
		
				io.to(session.player1.socketId).emit("match-found", session.player2);
				io.to(session.player2.socketId).emit("match-found", session.player1);
		
				games.push(session);
				session = new GameSession();
			}
			console.log("all games:", games)
		});
		

		socket.on("disconnect", () => {
			console.log("❌ User disconnected:", socket.id);

		});
	})
}
