import { handleJoin, handleDisconnect, handleUpdateData, handlePaddleMove } from "../controllers/gameController.js"

export default function initSocketManager(io) {
	io.on("connection", socket => {
		console.log("✅ Connected:", socket.id); // remove

		socket.on("paddle-move", (playerData)=>{
			handlePaddleMove(socket, io, playerData);
		})
		socket.on("update-data", (playerData)=>{
			handleUpdateData(socket, io, playerData);
		})

		socket.on("join-game", playerData => {
			handleJoin(socket, io, playerData);
		});

		socket.on("disconnect", () => {
			handleDisconnect(socket, io);
		});
		socket.on("leave-game", () => handleDisconnect(socket, io));
	});
}
