export function initSocketManager(io) {

	/* ---------------- game class ---------------- */
	class GameSession {
		constructor() {
			this.complete = false;
			this.gameRoom = "";
			this.player1 = {
				socketId: "",
				login: "",
				firstName: "",
				lastName: "",
				avatar: ""
			};
			this.player2 = {
				socketId: "",
				login: "",
				firstName: "",
				lastName: "",
				avatar: ""
			};
		}
	}
	
	let session = new GameSession();
	let games = [];
	
	io.on("connection", (socket) => {
		console.log("✅ New user connected:", socket.id);
	
		socket.on("join-game", (playerData) => {
	
			if (socket.id === session.player1.socketId ||
				socket.id === session.player2.socketId) {
				return;
			}

			if (!session.complete && session.player1.socketId === "") {

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
	
				session.complete = true;
	
				io.to(session.player1.socketId)
					.emit("match-found", session.player2);
	
				io.to(session.player2.socketId)
					.emit("match-found", session.player1);
	
				games.push(session);
				session = new GameSession();
			}
		});


		socket.on("disconnect", () => {
			console.log("❌ User disconnected:", socket.id);
	
			// Check if player1 or player2 in current session
			if (session.player1.socketId === socket.id) {
				session.player1 = { socketId: "", login: "", firstName: "", lastName: "", avatar: "" };
				session.complete = false; // reset the session if needed
			}
	
			if (session.player2.socketId === socket.id) {
				session.player2 = { socketId: "", login: "", firstName: "", lastName: "", avatar: "" };
				session.complete = false; // reset the session if needed
			}
	
			// Optionally remove this session from `games` if you already pushed it
			games = games.filter(g => g.player1.socketId !== socket.id && g.player2.socketId !== socket.id);
		});
	});
}
	