import { joinGame } from "../services/JoinGame.service.js"
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { Disconnection } from "../services/Disconnection.service.js"
import { onlineUsers } from "../store/memory.store.js"

export function onJoinGame(socket, io, player) {
	console.log("🔸​​ Socket Join Game:", socket.id)
	joinGame(socket, io, player)
}

export function onUpdateData(socket, io, player) {
	UpdateData(socket, io, player);
}

export function onPaddleMove(socket, io, paddle) {
	PaddleMove(socket, io, paddle);
}

export function onDisconnect(socket, io) {
	console.log("🔻​ Socket Disconnected:", socket.id)
	Disconnection(socket, io);
}

export function onUserOnline(socket, user) {
	console.log("🔻​ User Online:", socket.id)
	onlineUsers.set(user.username, user);
}
