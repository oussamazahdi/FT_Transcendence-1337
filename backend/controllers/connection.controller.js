import { GameAcceptService } from "../services/gameAccept.service.js";
import { Disconnection } from "../services/Disconnection.service.js"
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { joinGame } from "../services/JoinGame.service.js"
import { onlineUsers} from "../store/memory.store.js"
import { GameInviteService } from "../services/GameInvite.service.js";


class ConnectionController 
{
	onJoinGame(socket, io, player) {
		console.log("🔸​​ Socket Join Game:", socket.id)
		joinGame(socket, io, player)
	}
	
	onUpdateData(socket, io, player) {
		UpdateData(socket, io, player);
	}
	
	onPaddleMove(socket, io, paddle) {
		PaddleMove(socket, io, paddle);
	}
	
	onDisconnect(socket, io) {
		console.log("🔻​ Socket Disconnected:", socket.id)
		Disconnection(socket, io);
	}
	
	onUserOnline(socket, user) {
		console.log("🔻​ User Online:", socket.id)
		onlineUsers.set(user.id, user);
	}

	async onGameInvite(socket, io, data, ack) {
		GameInviteService.onGameInvite(socket, io, data, ack)
	}


	async onGameAccept(socket, io, data, ack) {
		GameAcceptService.onGameAccept(socket, io, data, ack);
	}
}
export const connectionController = new ConnectionController();