import { handleJoin, handleDisconnect, handleUpdateData } from "../controllers/gameController.js"

export default function initSocketManager(io) {
	io.on("connection", socket => {
		console.log("✅ Connected:", socket.id);

		socket.on("update-data", (playerData)=>{
			handleUpdateData(socket, io, playerData);
		})

		socket.on("join-game", playerData => {
			handleJoin(socket, io, playerData);
		});

		socket.on("disconnect", () => {
			handleDisconnect(socket, io);
		});
	});
}
