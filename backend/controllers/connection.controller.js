import { joinGame } from "../services/JoinGame.service.js"
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { Disconnection } from "../services/Disconnection.service.js"

export function onJoinGame(socket, io, player) {
	joinGame(socket, io, player)
}

export function onUpdateData(socket, io, player) {
	UpdateData(socket, io, player);
}

export function onPaddleMove(socket, io, paddle) {
	PaddleMove(socket, io, paddle);
}

export function onDisconnect(socket, io) {
	Disconnection(socket, io);
}
