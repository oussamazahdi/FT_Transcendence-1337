import { connectionController } from "../controllers/connection.controller.js";
import { chatController } from "../controllers/chat.controller.js";
import { onlineUsers } from "../store/memory.store.js";
import { GameAcceptService } from "../services/gameAccept.service.js";
import { GameUtils } from "../utils/GameUtils.js";

/*

{
    "sender_id": 1, number, interger not null
    "recever_id": 2, number, interger not null
    "room_id": "qweo",
    "created_at": "2006-12-04 12:35:42", 
    "type": "game invite"
}

*/


export function initSocketManager(io) {
  io.on("connection", (socket) => {
		// console.log("​✅​ ❇️ socket connected:", socket.id)
		const userId = socket.user?.userId;
    if (userId) {
			socket.join(`user:${userId}`);
      socket.join(`chat:${userId}`);
    }
		onlineUsers.set(userId, socket.id);
		// console.log("❇️❇️❇️❇️❇️❇️❇️❇️❇️❇️ online users :", userId, onlineUsers.get(userId), onlineUsers.keys());
		
    io.emit("users:status", Array.from(onlineUsers.keys()));
    socket.on("join-game", (data) => connectionController.onJoinGame(socket, io, data));
    socket.on("update-data", (data) => connectionController.onUpdateData(socket, io, data));
    socket.on("paddle-move", (data) => connectionController.onPaddleMove(socket, io, data));
    
    socket.on("disconnect", () => {
			// console.log("​🔻 ❇️ socket disconnected")
      connectionController.onDisconnect(socket, io);
    });
    socket.on("leave-game", () => connectionController.onDisconnect(socket, io));
    
    socket.on("game:invite", (data, ack) =>
      connectionController.onGameInvite(socket, io, data, ack)
    );
    socket.on("game:accept", async (data, ack) => {
      connectionController.onGameAccept(socket, io, data, ack);
    });

		// socket.on("chat:game:accept", (data, ack)=>{
		// 	console.log("====> this is all data from chat:game:accept:", data);
		// })
    socket.on("chat:send", (data) => chatController.sendMessage(socket, io, data));
    socket.on("chat:error", (error) => {
      console.error(error.message);
    });


		socket.on("Postman", async (data, ack) => {

			const senderId = Number(data?.sender_id);
			const receiverId = Number(data?.recever_id);
			const roomId = data?.room_id;
			const db = io.db;
			let bindInfo = null;


			if( !Number.isInteger(senderId) || !Number.isInteger(receiverId) || 
			receiverId <= 0 || senderId <= 0 || receiverId === senderId)
				ack?.({ok:false, message:"Invalide sender or recever id"});
			
			if (!data?.room_id || !data?.type || data?.type !== "game invite")
				ack?.({ok:false, message:"Invalide roomId or type"});

			if(!data?.expired_at || typeof data?.expired_at !== "string" )
				ack?.({ok:false, message:"Invalide expiration date"});
			const expiration_date = new Date(data?.expired_at);
			const now = new Date();
			
			if(expiration_date > now)
				ack?.({ok:false, message:"Game invite expired"});
			
			const playersData = await GameAcceptService.loadPlayersData(db, senderId, receiverId, io);
			if (!playersData?.ok)
				ack?.({ok:false, message: playersData?.message});

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
			p1Socket.join(current.room_id);
    	p2Socket.join(current.room_id);

			io.to(current.roomId).emit("match-started:accept", current.roomId);
			setTimeout(()=> GameUtils.startGameLoop(io, current.roomId), 3000);
			io.to(current.roomId).emit("match-data", current);

			ack?.({ok:true, data: data, message: "Success"});
		});


  });
}
