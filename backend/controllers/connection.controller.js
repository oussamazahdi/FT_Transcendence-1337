import { Disconnection } from "../services/Disconnection.service.js"
import { NotifServices } from "../services/Notification.service.js";
import { httpError } from "../services/Notification.service.js";
import { UpdateData } from "../services/UpdateData.service.js"
import { PaddleMove } from "../services/PaddleMove.service.js"
import { joinGame } from "../services/JoinGame.service.js"
import { onlineUsers, waitingPlayer, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js"
import { userModels } from "../models/user.model.js";
import { isValidPlayerData, getGameByUsername } from "../utils/GameUtils.js"
import { GameSession, Paddle } from "../store/game.store.js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants/game.constants.js"
import { startGameLoop } from "../utils/GameUtils.js";
import { GameAcceptService } from "../services/gameAccept.service.js";

function joinSocketToGameRoom(io, userId, roomId) {
	const socketId = onlineUsers.get(userId);
	const playerSocket = io.socket.socket.get(socketId);
	playerSocket.join(roomId);
	return (socketId);
}


function playerIsValid(data) {
	console.log("data:", data)
	return ( data && typeof data === "object" &&
		typeof data.username === "string" &&
		data.username.length > 0 &&
		data.username.length <= 20 &&
		typeof data.firstname === "string" &&
		typeof data.lastname === "string" &&
		typeof data.avatar === "string"
	);
}


const loadAndValidateData = async (data, io) => {

	if (!data || typeof data !== "object") return {ok:false, message:"Invalid payload"};
	
	const notifId = Number(data?.notifId);
	if (!Number.isInteger(notifId) || notifId <= 0) return {ok:false, message:"Invalid notifId"};
	
	const db = io?.db;
	if (!db) return {ok:false, message:"DB not attached to io"};
	
	const notification = await NotifServices.getById(db, notifId);
	if (!notification || typeof notification !== "object") { return {ok:false, message:"Notification not found"}}
	if (notification.type !== "game_invite") { return {ok:false, message:"Notification type is not game_invite"}}
	if (notification.is_expired) { return {ok:false, message:"Notification expired"}; }
	
	const roomId = notification?.payload?.roomId ? notification.payload.roomId : randomUUID();

	return { ok: true, notifId, roomId, notification, db };
}

const authorizeReceiver = (socket, notification)=>{
	const receiverId = Number(notification.receiver_id);
	const senderId = Number(notification.sender_id);

	
	if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) { return {ok:false, message:"Notification has invalid sender/receiver"} }
	
	const socketUserId = Number(socket?.user?.userId);
	
	if (!Number.isInteger(socketUserId)) return {ok:false, message:"Unauthenticated"};
	if (socketUserId !== receiverId) return {ok:false, message:"Forbidden: not notification receiver" }
	
	return ({ok:true, receiverId, senderId});
}

const loadPlayersData = async (db, senderId, receiverId, io)=>{
	try{

		const player1 = await userModels.getUserById(db, senderId);
		const player2 = await userModels.getUserById(db, receiverId);
		
		if (!playerIsValid(player1) || !playerIsValid(player2)) return {ok:false, message:"Invalid player data"};
		if (getGameByUsername(player1.username) || getGameByUsername(player2.username)) return { ok:false, message:"One of the players is already in a game" };
		if (usernameToSocket.has(player1.username) || usernameToSocket.has(player2.username)) return { ok:false, message:"One of the players is already in a game"};
		
		const p1SocketId = onlineUsers?.get?.(senderId);
		const p2SocketId = onlineUsers?.get?.(receiverId);
		
		if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string") return { ok:false, message:"One of the players is offline" }
		
		const p1Socket = io.sockets.sockets.get(p1SocketId);
		const p2Socket = io.sockets.sockets.get(p2SocketId);
		
		if (!p1Socket || !p2Socket) return { ok:false, message:"Player socket missing"};
		
		return { ok: true, player1, player2, p1SocketId, p2SocketId, p1Socket, p2Socket };
	
	} catch(err) {
		return {ok: false, message: "Unexpected error while loading players data"};
	}
}



const createGameSession = ({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 })=>{
	const game = new GameSession();
	game.roomId = roomId;

	Object.assign(game.player1, {
		id: senderId,
		socketId: p1SocketId,
		firstName: player1.firstname,
		lastName: player1.lastname,
		username: player1.username,
		avatar: player1.avatar,
		roomId,
		player: new Paddle(40),
	});

	Object.assign(game.player2, {
		id: receiverId,
		socketId: p2SocketId,
		firstName: player2.firstname,
		lastName: player2.lastname,
		username: player2.username,
		avatar: player2.avatar,
		roomId,
		player: new Paddle(GAME_WIDTH - 60),
	});

	game.state = "MATCHED";

	activeGames.set(game.roomId, game);
	const current = activeGames.get(game.roomId);
	if (!current || current.state !== "MATCHED") {
		activeGames.delete(game.roomId);
		return { result:{ok:false, message:"Failed to create match"}, current};
	}

	return {result:{ok:true, current}, current};
}

const bindUserToSocket = ({ player1, player2, p1SocketId, p2SocketId })=>{
		// console.log("---------------------------------->> before binding all sockets");
		usernameToSocket.set(player1.username, p1SocketId);
		usernameToSocket.set(player2.username, p2SocketId);

		socketToUsername.set(p1SocketId, player1.username);
		socketToUsername.set(p2SocketId, player2.username);
		// console.log("---------------------------------->> we bind all sockets");
}

const unbindUsernameSocketMaps = ({ player1, player2, p1SocketId, p2SocketId })=> {
	if (player1?.username) usernameToSocket.delete(player1.username);
	if (player2?.username) usernameToSocket.delete(player2.username);
	if (p1SocketId) socketToUsername.delete(p1SocketId);
	if (p2SocketId) socketToUsername.delete(p2SocketId);
}

function cleanupGame(game) {
	try {
		if (!game) return;
		activeGames?.delete?.(game.roomId);
	} catch (_) {}
}






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
		try {
			const { user, roomId, gameType } = data ?? {};
			
			if (!user || !roomId || !gameType) {
				throw httpError(400, "user, roomId, gameType are required");
			}
			
			const userId = socket.user?.userId;
			// console.log("receve game invite :", data);
			if (!userId) {
				throw httpError(401, "Unauthorized");
			}
			
			if (user === userId) {
				throw httpError(400, "You cannot invite yourself");
			}
			
			const notif = await NotifServices.create(socket.db, {
				senderId: userId,
				receiverId: user,
				type: "game_invite",
				title: "Game invite",
				message: "You received a game invite",
				payload: { roomId, gameType },
			});
			
			io.to(`user:${user}`).emit("notification:new", notif);
			ack?.({ ok: true, notification: notif });
		} catch (error) {
			ack?.({
				ok: false,
				statusCode: error?.statusCode ?? 500,
				message: error?.message ?? "Internal server error",
			});
		}
	}



/**
Waiting Player: {
  socketId: 'oaT1-MQNlDiSg4J7AAAF',
  player: {
    firstName: 'Saloua',
    lastName: 'El aadali',
    username: 'sel-aada',
    avatar: 'http://localhost:3001/uploads/sel-aada-1769959093588.jpeg',
    id: 1
  }
}

Second Player: {
  firstName: 'Oussama',
  lastName: 'Zahdi',
  username: 'Ozahdi',
  avatar: 'http://localhost:3001/uploads/Ozahdi-1769959105586.jpeg',
  id: 2
}

Full Notification: {
  id: 16,
  sender_id: 1,
  receiver_id: 2,
  type: 'game_invite',
  title: 'Game invite',
  message: 'You received a game invite',
  payload: {
    roomId: '9aa91dd5-1511-40a1-b4d5-eb19f056f71b',
    gameType: 'pingpong'
  },
  status: 'accepted',
  is_read: 1,
  expires_at: '2026-02-01T17:14:23.021Z',
  is_expired: 0,
  created_at: '2026-02-01 17:13:23'
}

Data: {
	notifId: 18,
	roomId: '1a7e2008-79bb-406a-b2c9-cdfac81564c2' 
}

player1: {
  id: 2,
  firstname: 'Oussama',
  lastname: 'Zahdi',
  username: 'Ozahdi',
  email: 'patin62421@gamening.com',
  avatar: 'http://localhost:3001/uploads/Ozahdi-1769959105586.jpeg'
} 
 player2: {
  id: 1,
  firstname: 'Saloua',
  lastname: 'El aadali',
  username: 'sel-aada',
  email: 'poroxa5707@juhxs.com',
  avatar: 'http://localhost:3001/uploads/sel-aada-1769959093588.jpeg'
}



 */



/**
 * [x] @get Notification data; 
 * [x] @get sender data (first name, last name, username, avatar)
 * [x] @get receiver data (first name, last name, username, avatar)
 * [ ] @get sender and receiver socketId from storing arrays
 * [ ] @join players to room [roomId]
 * [ ] @notif players that game has been accepted
 * [ ] @rederect them to game page and start the game[shuld be normal like the match making use the same functions]
 */

	async onGameAccept(socket, io, data, ack) {
		const game = null;
		let bindInfo = null;
		
		
		try{
			// const roomId = data?.roomId || null;
			// const notification = await NotifServices.getById(io.db, Number(data.notifId));
			// if (!roomId || roomId <= 0 || typeof roomId !== "string"
			// 		|| !notification || typeof notification !== "object") return;
			
			const validation = await loadAndValidateData(data, io);
			if (!validation.ok) throw new Error(validation?.message);
			const {notifId, roomId, notification, db} = validation;
			
			const authorization = authorizeReceiver(socket, notification);
			if (!authorization.ok) throw new Error(authorization?.message);
			const {receiverId, senderId} = authorization;
			// console.log("*********************************************************2");
			
			const playersData = await loadPlayersData(db, senderId, receiverId, io);
			if (!playersData?.ok) throw new Error(playersData?.message);
			const {player1, player2, p1SocketId, p2SocketId, p1Socket, p2Socket} = playersData
			// console.log("*********************************************************3");
			
			bindInfo = { player1, player2, p1SocketId, p2SocketId };
			bindUserToSocket(bindInfo);
			// console.log("*********************************************************4");
			
			const GameInfo = { roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 };
			const { result, current } = createGameSession(GameInfo);
			console.log("*********************************************************5");
			if (!result.ok){
				cleanupGame(current)
				if (bindInfo) unbindUsernameSocketMaps(bindInfo);
				console.log("*********************************************************> 99");
				throw new Error(result?.message);
			}
			console.log("*********************************************************6");
			
			// console.log("*********************************************************4");
			

			
			
			// const player1 = userModels.getUserById(io.db, notification.sender_id) || null;
			// const player2 = userModels.getUserById(io.db, notification.receiver_id) || null;
			
			// if (!isValidPlayerData(player2) || !isValidPlayerData(player1)) return;
			// if (getGameByUsername(player1?.username) || getGameByUsername(player2?.username)) return;
			// if (usernameToSocket.has(player1?.username) || usernameToSocket.has(player2?.username)) return;

			// 	/* we should bined usernames with socket Ids */
			// const game = new GameSession();
			// game.roomId = notification?.payload?.roomId;
			// if (!game?.roomId) game.roomId = randomUUID();
			
			// Object.assign(game.player1, {
			// 	id : notification.sender_id,
			// 	socketId : onlineUsers.get(notification.sender_id),
			// 	firstName : player1.firstname,
			// 	lastName : player1.lastname,
			// 	username : player1.username,
			// 	avatar : player1.avatar,
			// 	roomId: game.roomId,
			// 	player: new Paddle(40),
			// })
			// Object.assign(game.player2, {
			// 	id : notification.receiver_id,
			// 	socketId : onlineUsers.get(notification.receiver_id),
			// 	firstName : player2.firstname,
			// 	lastName : player2.lastname,
			// 	username : player2.username,
			// 	avatar : player2.avatar,
			// 	roomId: game.roomId,
			// 	player: new Paddle(GAME_WIDTH - 60),
			// })

			// // console.log("************> player1:", game.player1.socketId)
			// // console.log("************> player2:", game.player2.socketId)
			
			// game.state = "MATCHED";
			// activeGames.set(game.roomId, game);

			// const current = activeGames.get(game.roomId);
    	// if (!current || current.state !== "MATCHED") return;

			// const p1Socket = io.sockets.sockets.get(game.player1.socketId);
    	// const p2Socket = io.sockets.sockets.get(game.player2.socketId);

			// if (!p1Socket || !p2Socket) {
			// 	if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
			// 	if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
			// 	cleanupPlayers(game);
			// 	removeGame(game.roomId);
			// 	return;
			// }

			current.state = "PLAYING";

			p1Socket.join(current.roomId);
    	p2Socket.join(current.roomId);

			console.log("current.roomId:", current.roomId);
			console.log("current:", current);

			io.to(current.roomId).emit("match-started", current.roomId);
			setTimeout(()=> startGameLoop(io, current.roomId), 3000);
			io.to(current.roomId).emit("match-data", current);
			
			
			// // io.to(game.player1.socketId).emit("match-accepted", game.player2);
			// // io.to(game.player2.socketId).emit("match-accepted", game.player1);
			
			
			// game.matchTimeOut = setTimeout(() => {
			// 	const current = activeGames.get(game.roomId);
			// 	if (!current || current.state !== "MATCHED") return;
				
			// 	const p1Socket = io.sockets.sockets.get(game.player1.socketId);
			// 	const p2Socket = io.sockets.sockets.get(game.player2.socketId);
				
			// 	if (!p1Socket || !p2Socket) {
			// 		if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
			// 		if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
			// 		cleanupPlayers(game);
			// 		removeGame(game.roomId);
			// 		return;
			// 	}
				
			// 	game.state = "PLAYING";
				
			// 	p1Socket.join(game.roomId);
			// 	p2Socket.join(game.roomId);
				
			// 	io.to(game.roomId).emit("match-started", game.roomId);
			// 	setTimeout(()=> startGameLoop(io, game.roomId), 3000);
			// 	// startGameLoop(io, game.roomId);
			// 	io.to(game.roomId).emit("match-data", game);
			// }, 3000);
			
			
			// // startMatch(io, game);
			ack?.({ ok: true, notification: notification, message: "Success" });
		} catch(err) {
				ack?.({ ok: false, notification: null , message: err?.message });
		}
	}









// 	async onGameAccept(socket, io, data, ack) {
// 	try{
// 		const roomId = data?.roomId || null;
// 		const notification = await NotifServices.getById(io.db, Number(data.notifId));
// 		if (!roomId || roomId <= 0 || typeof roomId !== "string"
// 				|| !notification || typeof notification !== "object") return;
		
// 		const player1 = userModels.getUserById(io.db, notification.sender_id) || null;
// 		const player2 = userModels.getUserById(io.db, notification.receiver_id) || null;
		
// 		// if (!isValidPlayerData(player2) || !isValidPlayerData(player1)) return;
// 		// if (getGameByUsername(player1?.username) || getGameByUsername(player2?.username)) return;
// 		// if (usernameToSocket.has(player1?.username) || usernameToSocket.has(player2?.username)) return;

// 		// 	/* we should bined usernames with socket Ids */
// 		const game = new GameSession();
// 		game.roomId = notification?.payload?.roomId;
// 		if (!game?.roomId) game.roomId = randomUUID();
		
// 		Object.assign(game.player1, {
// 			id : notification.sender_id,
// 			socketId : onlineUsers.get(notification.sender_id),
// 			firstName : player1.firstname,
// 			lastName : player1.lastname,
// 			username : player1.username,
// 			avatar : player1.avatar,
// 			roomId: game.roomId,
// 			player: new Paddle(40),
// 		})
// 		Object.assign(game.player2, {
// 			id : notification.receiver_id,
// 			socketId : onlineUsers.get(notification.receiver_id),
// 			firstName : player2.firstname,
// 			lastName : player2.lastname,
// 			username : player2.username,
// 			avatar : player2.avatar,
// 			roomId: game.roomId,
// 			player: new Paddle(GAME_WIDTH - 60),
// 		})

// 		game.state = "MATCHED";
// 		activeGames.set(game.roomId, game);

// 		const current = activeGames.get(game.roomId);
// 		if (!current || current.state !== "MATCHED") return;

// 		const p1Socket = io.sockets.sockets.get(game.player1.socketId);
// 		const p2Socket = io.sockets.sockets.get(game.player2.socketId);

// 		if (!p1Socket || !p2Socket) {
// 			if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
// 			if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
// 			cleanupPlayers(game);
// 			removeGame(game.roomId);
// 			return;
// 		}

// 		game.state = "PLAYING";

// 		p1Socket.join(game.roomId);
// 		p2Socket.join(game.roomId);

// 		io.to(game.roomId).emit("match-started", game.roomId);
// 		setTimeout(()=> startGameLoop(io, game.roomId), 3000);
// 		io.to(game.roomId).emit("match-data", game);
// 		ack?.({ ok: true, notification: notif, message: "Success" });
// 	} catch(err) {
// 			ack?.({ ok: false, notification: null , message: err?.message });
// 	}
// }









	// async onGameAccept(socket, io, data, ack) {
	// 	const ThrowError = (message, code = 400)=>{
	// 		ack?.({ ok: false, notification: null , message: message, code });
	// 		return;
	// 	}

	// 	let game = null;
	// 	try{
	// 		if (!data || typeof data !== "object") return ThrowError("Invalid payload");
			
	// 		const notifId = Number(data?.notifId);
  //   	if (!Number.isInteger(notifId) || notifId <= 0) return ThrowError("Invalid notifId");
			
	// 		const db = io?.db;
  //   	if (!db) return ThrowError("DB not attached to io", 500);

	// 		const notification = await NotifServices.getById(db, notifId);
  //  		if (!notification || typeof notification !== "object") return fail("Notification not found", 404);

	// 		if (notification.type !== "game_invite") return fail("Notification type is not game_invite");
	// 		if (notification.status !== "pending") return fail("Notification is not pending");
	// 		if (notification.is_expired) return fail("Notification expired");

	// 		const receiverId = Number(notification.receiver_id);
  //   	const senderId = Number(notification.sender_id);

  //   	if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) return fail("Notification has invalid sender/receiver");

	// 		const socketUserId = Number(socket?.user?.userId);
  //   	if (!Number.isInteger(socketUserId)) return fail("Unauthenticated", 401);
  //   	if (socketUserId !== receiverId) return fail("Forbidden: not notification receiver", 403);

	// 		const payloadRoomId = notification?.payload?.roomId;
  //   	let roomId = (typeof payloadRoomId === "string" && payloadRoomId.trim()) ? payloadRoomId.trim() : null;
  //   	if (!roomId) roomId = randomUUID();

	// 		const player1 = await userModels.getUserById(db, senderId);
  //   	const player2 = await userModels.getUserById(db, receiverId);
  //   	if (!isValidPlayerData(player1) || !isValidPlayerData(player2)) return fail("Invalid player data");
	// 		if (getGameByUsername(player1.username) || getGameByUsername(player2.username)) return fail("One of the players is already in a game", 409);
	// 		if (usernameToSocket.has(player1.username) || usernameToSocket.has(player2.username)) return fail("One of the players is already in a game", 409);

	// 		const p1SocketId = onlineUsers?.get?.(senderId);
  //   	const p2SocketId = onlineUsers?.get?.(receiverId);
	// 		if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string") return fail("One of the players is offline", 409);

	// 		usernameToSocket.set(player1.username, p1Socket);
	// 		usernameToSocket.set(player2.username, p2Socket);
	// 		socketToUsername.set(p1Socket, player1.username);
	// 		socketToUsername.set(p2Socket ,player2.username);
			
	// 		const p1Socket = io.sockets.sockets.get(p1SocketId);
  //   	const p2Socket = io.sockets.sockets.get(p2SocketId);
	// 		if (!p1Socket || !p2Socket){
	// 			cleanupPlayers(game);
	// 			return fail("Player socket missing", 409);
	// 		} 

	// 		game = new GameSession();
  //   	game.roomId = roomId;

  //   	Object.assign(game.player1, {
  //   	  id: senderId,
  //   	  socketId: p1SocketId,
  //   	  firstName: player1.firstname,
  //   	  lastName: player1.lastname,
  //   	  username: player1.username,
  //   	  avatar: player1.avatar,
  //   	  roomId: roomId,
  //   	  player: new Paddle(40),
  //   	});

  //   	Object.assign(game.player2, {
  //   	  id: receiverId,
  //   	  socketId: p2SocketId,
  //   	  firstName: player2.firstname,
  //   	  lastName: player2.lastname,
  //   	  username: player2.username,
  //   	  avatar: player2.avatar,
  //   	  roomId: roomId,
  //   	  player: new Paddle(GAME_WIDTH - 60),
  //   	});

  //   	game.state = "MATCHED";
  //   	activeGames.set(game.roomId, game);

	// 		const current = activeGames.get(game.roomId);
  //   	if (!current || current.state !== "MATCHED") {
  //     	activeGames.delete(game.roomId);
  //     	return fail("Failed to create match", 500);
  //   	}

	// 		p1Socket.join(game.roomId);
  //   	p2Socket.join(game.roomId);

	// 		game.state = "PLAYING";

	// 		io.to(game.roomId).emit("match-started", { roomId: game.roomId });
	// 		io.to(game.roomId).emit("match-data", game);
	
	// 		setTimeout(() => { startGameLoop(io, game.roomId); }, 3000);

	// 		ack?.({ ok: true, notification, message: "Success", roomId: game.roomId })
		
	// 	} catch(err) {
	// 			ack?.({ ok: false, notification: null , message: err?.message });
	// 	}
	// }
	

	// async onGameAccept(socket, io, data, ack) {
	// 	GameAcceptService.onGameAccept(socket, io, data, ack)
	// 	// io.to(game.roomId).emit("match-data", game);
	// }
}








// async onGameAccept(socket, io, data, ack) {
// 	try{
// 		const roomId = data?.roomId || null;
// 		const notification = await NotifServices.getById(io.db, Number(data.notifId));
// 		if (!roomId || roomId <= 0 || typeof roomId !== "string"
// 				|| !notification || typeof notification !== "object") return;
		
// 		const player1 = userModels.getUserById(io.db, notification.sender_id) || null;
// 		const player2 = userModels.getUserById(io.db, notification.receiver_id) || null;
		
// 		if (!isValidPlayerData(player2) || !isValidPlayerData(player1)) return;
// 		if (getGameByUsername(player1?.username) || getGameByUsername(player2?.username)) return;
// 		if (usernameToSocket.has(player1?.username) || usernameToSocket.has(player2?.username)) return;

// 		// 	/* we should bined usernames with socket Ids */
// 		const game = new GameSession();
// 		game.roomId = notification?.payload?.roomId;
// 		if (!game?.roomId) game.roomId = randomUUID();
		
// 		Object.assign(game.player1, {
// 			id : notification.sender_id,
// 			socketId : onlineUsers.get(notification.sender_id),
// 			firstName : player1.firstname,
// 			lastName : player1.lastname,
// 			username : player1.username,
// 			avatar : player1.avatar,
// 			roomId: game.roomId,
// 			player: new Paddle(40),
// 		})
// 		Object.assign(game.player2, {
// 			id : notification.receiver_id,
// 			socketId : onlineUsers.get(notification.receiver_id),
// 			firstName : player2.firstname,
// 			lastName : player2.lastname,
// 			username : player2.username,
// 			avatar : player2.avatar,
// 			roomId: game.roomId,
// 			player: new Paddle(GAME_WIDTH - 60),
// 		})

// 		game.state = "MATCHED";
// 		activeGames.set(game.roomId, game);

// 		const current = activeGames.get(game.roomId);
// 		if (!current || current.state !== "MATCHED") return;

// 		const p1Socket = io.sockets.sockets.get(game.player1.socketId);
// 		const p2Socket = io.sockets.sockets.get(game.player2.socketId);

// 		if (!p1Socket || !p2Socket) {
// 			if (p1Socket) io.to(game.player1.socketId).emit("match-canceled");
// 			if (p2Socket) io.to(game.player2.socketId).emit("match-canceled");
// 			cleanupPlayers(game);
// 			removeGame(game.roomId);
// 			return;
// 		}

// 		game.state = "PLAYING";

// 		p1Socket.join(game.roomId);
// 		p2Socket.join(game.roomId);

// 		io.to(game.roomId).emit("match-started", game.roomId);
// 		setTimeout(()=> startGameLoop(io, game.roomId), 3000);
// 		io.to(game.roomId).emit("match-data", game);
// 		ack?.({ ok: true, notification: notif, message: "Success" });
// 	} catch(err) {
// 			ack?.({ ok: false, notification: null , message: err?.message });
// 	}
// }



export const connectionController = new ConnectionController();
