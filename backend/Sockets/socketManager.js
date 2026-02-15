import { connectionController } from "../controllers/connection.controller.js";
import { chatController } from "../controllers/chat.controller.js";
import { onlineUsers } from "../store/memory.store.js";
import { GameAcceptService } from "../services/gameAccept.service.js";
import { GameUtils } from "../utils/GameUtils.js";
import { chatModels } from "../models/chat.model.js";



export function initSocketManager(io) {
  io.on("connection", (socket) => {
		const userId = socket.user?.userId;
    if (userId) {
			socket.join(`user:${userId}`);
      socket.join(`chat:${userId}`);
    }
		onlineUsers.set(userId, socket.id);
    io.emit("users:status", Array.from(onlineUsers.keys()));
    socket.on("join-game", (data) => connectionController.onJoinGame(socket, io, data));
    socket.on("update-data", (data) => connectionController.onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => connectionController.onPaddleMove(socket, io, data));
    
    socket.on("disconnect", () => {
      connectionController.onDisconnect(socket, io);
    });
    socket.on("leave-game", () => connectionController.onDisconnect(socket, io));
    
    socket.on("game:invite", (data, ack) =>
      connectionController.onGameInvite(socket, io, data, ack)
    );
    socket.on("game:accept", async (data, ack) => {
      connectionController.onGameAccept(socket, io, data, ack);
    });

    socket.on("chat:send", (data) => chatController.sendMessage(socket, io, data));

	socket.on("chat:game:accept", async (data, ack) => {

		const senderId = Number(data?.sender_id);
		const receiverId = Number(data?.recever_id);
		const roomId = data?.room_id;
		const db = io.db;
		const msgId = data?.msgId;
		let bindInfo = null;
		let gameInvite = null;

		try{
			gameInvite = await chatModels.getMessageById(db, msgId);
			if (!gameInvite) throw new Error("Message not found");
			
			if (gameInvite.status && gameInvite.status !== "pending")
				throw new Error("Invalide game invite");

			if(!gameInvite?.expired_at || typeof gameInvite?.expired_at !== "string" )
				ack?.({ok:false, message:"Invalide expiration date"});
			
			const expiration_date = new Date(gameInvite?.expired_at);
			const now = new Date();
			
			if(now > expiration_date)
				throw new Error("Game invite expired");
			
			if( !Number.isInteger(senderId) || !Number.isInteger(receiverId) || 
			receiverId <= 0 || senderId <= 0 || receiverId === senderId)
				throw new Error("Invalide sender or recever id");
				
			if (!data?.room_id || !data?.type || data?.type !== "game_invite")
				throw new Error("Invalide roomId or type");
			
			const playersData = await GameAcceptService.loadPlayersData(db, senderId, receiverId, io);
			if (!playersData?.ok)
				throw new Error(playersData?.message);
			
			const {player1, player2, p1SocketId, p2SocketId, p1Socket, p2Socket} = playersData
			
			bindInfo = { player1, player2, p1SocketId, p2SocketId };
			GameAcceptService.bindUserToSocket(bindInfo);
			
			const GameInfo = { roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 };
			
			const { result, current } = GameAcceptService.createGameSession(GameInfo);
			if (!result.ok){
				GameAcceptService.cleanupGame(current)
				if (bindInfo) GameAcceptService.unbindUsernameSocketMaps(bindInfo);
				throw new Error(result?.message);
			}

			current.state = "PLAYING";
			p1Socket.join(current.roomId);
			p2Socket.join(current.roomId);

			chatModels.setInviteStatus(db, msgId, "accepted")
			
			io.to(current.roomId).emit("match-started:accept", current.roomId);
			setTimeout(()=> GameUtils.startGameLoop(io, current.roomId), 3000);
			io.to(current.roomId).emit("match-data", current);

			ack?.({ok:true, data: data, message: "Success"});
		}catch(err){
			ack?.({ok:false, message: err?.message});
		}
	});
	
	socket.on("chat:game:reject", async (data, ack)=>{
		try{
			const db = io.db;
			const gameInvite = await chatModels.getMessageById(db, data?.msgId);
			if (!gameInvite) throw new Error("Message not found");

			if (gameInvite.status && gameInvite.status !== "pending")
				throw new Error("Invalide game invite");
			
			if (!data?.type || data?.type !== "game_invite")
				throw new Error("Invalide roomId or type");
			
			chatModels.setInviteStatus(db, data?.msgId, "rejected")
			ack?.({ok:true, data: data, message: "Success"});
		}catch(err){
			ack?.({ok:false, message: err?.message});
		}
	});


  });
}
