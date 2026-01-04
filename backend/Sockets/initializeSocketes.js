import { Server } from "socket.io"
import { initSocketManager } from "./socketManager.js"

export function initializeSocketes(app) {
	const io = new Server(app.server, {
		cors: {
			origin: process.env.FRONTEND_URL,
			methods: ["GET", "POST"]
		},
		transports: ["websocket"]
	})
	app.decorate("io", io);
	app.io.on("connection", socket => {
		console.log("✅​ Socket connected:", socket.id);
		initSocketManager(io)
	});
}