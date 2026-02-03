// // import {
// //   onlineUsers,
// //   socketToUsername,
// //   usernameToSocket,
// //   activeGames,
// // } from "../store/memory.store.js";

// // import { isValidPlayerData, getGameByUsername } from "../utils/GameUtils.js";
// // import { NotifServices } from "../services/Notification.service.js";
// // import { GameSession, Paddle } from "../store/game.store.js";
// // import { GAME_WIDTH } from "../constants/game.constants.js";
// // import { startGameLoop } from "../utils/GameUtils.js";
// // import { userModels } from "../models/user.model.js";

// // import { randomUUID } from "crypto";

// // class GameAcceptService {
// //   // --- error object factory (does NOT call ack)
// //   err(message, code = 400) {
// //     return { ok: false, notification: null, message, code };
// //   }

// //   // --- small safe ack wrapper
// //   safeAck(ack, payload) {
// //     try {
// //       ack?.(payload);
// //     } catch (_) {}
// //   }

// //   parseNotifId(data) {
// //     if (!data || typeof data !== "object") return this.err("Invalid payload");

// //     const notifId = Number(data?.notifId);
// //     if (!Number.isInteger(notifId) || notifId <= 0) return this.err("Invalid notifId");

// //     return { ok: true, notifId };
// //   }

// //   getDb(io) {
// //     const db = io?.db;
// //     if (!db) return this.err("DB not attached to io", 500);
// //     return { ok: true, db };
// //   }

// //   async loadAndValidateNotification(db, notifId) {
// //     const notification = await NotifServices.getById(db, notifId);

// //     if (!notification || typeof notification !== "object") {
// //       return this.err("Notification not found", 404);
// //     }

// //     if (notification.type !== "game_invite") {
// //       return this.err("Notification type is not game_invite");
// //     }

// //     if (notification.status !== "pending") {
// //       return this.err("Notification is not pending");
// //     }

// //     if (notification.is_expired) {
// //       return this.err("Notification expired");
// //     }

// //     return { ok: true, notification };
// //   }

// //   authorizeReceiver(socket, notification) {
// //     const receiverId = Number(notification.receiver_id);
// //     const senderId = Number(notification.sender_id);

// //     if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) {
// //       return this.err("Notification has invalid sender/receiver");
// //     }

// //     const socketUserId = Number(socket?.user?.userId);
// //     if (!Number.isInteger(socketUserId)) return this.err("Unauthenticated", 401);

// //     if (socketUserId !== receiverId) {
// //       return this.err("Forbidden: not notification receiver", 403);
// //     }

// //     return { ok: true, receiverId, senderId };
// //   }

// //   resolveRoomId(notification) {
// //     const payloadRoomId = notification?.payload?.roomId;
// //     const roomId =
// //       typeof payloadRoomId === "string" && payloadRoomId.trim().length > 0
// //         ? payloadRoomId.trim()
// //         : randomUUID();

// //     return roomId;
// //   }

// //   async loadPlayers(db, senderId, receiverId) {
// //     const player1 = await userModels.getUserById(db, senderId);
// //     const player2 = await userModels.getUserById(db, receiverId);

// //     if (!isValidPlayerData(player1) || !isValidPlayerData(player2)) {
// //       return this.err("Invalid player data");
// //     }

// //     if (getGameByUsername(player1.username) || getGameByUsername(player2.username)) {
// //       return this.err("One of the players is already in a game", 409);
// //     }

// //     // Keep your original logic: if username is already bound, reject
// //     if (usernameToSocket.has(player1.username) || usernameToSocket.has(player2.username)) {
// //       return this.err("One of the players is already in a game", 409);
// //     }

// //     return { ok: true, player1, player2 };
// //   }

// //   resolveOnlineSocketIds(senderId, receiverId) {
// //     const p1SocketId = onlineUsers?.get?.(senderId);
// //     const p2SocketId = onlineUsers?.get?.(receiverId);

// //     if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string") {
// //       return this.err("One of the players is offline", 409);
// //     }

// //     return { ok: true, p1SocketId, p2SocketId };
// //   }

// //   getLiveSockets(io, p1SocketId, p2SocketId) {
// //     const p1Socket = io.sockets.sockets.get(p1SocketId);
// //     const p2Socket = io.sockets.sockets.get(p2SocketId);

// //     if (!p1Socket || !p2Socket) return this.err("Player socket missing", 409);

// //     return { ok: true, p1Socket, p2Socket };
// //   }

// //   bindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId }) {
// //     usernameToSocket.set(player1.username, p1SocketId);
// //     usernameToSocket.set(player2.username, p2SocketId);

// //     socketToUsername.set(p1SocketId, player1.username);
// //     socketToUsername.set(p2SocketId, player2.username);
// //   }

// //   createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 }) {
// //     const game = new GameSession();
// //     game.roomId = roomId;

// //     Object.assign(game.player1, {
// //       id: senderId,
// //       socketId: p1SocketId,
// //       firstName: player1.firstname,
// //       lastName: player1.lastname,
// //       username: player1.username,
// //       avatar: player1.avatar,
// //       roomId,
// //       player: new Paddle(40),
// //     });

// //     Object.assign(game.player2, {
// //       id: receiverId,
// //       socketId: p2SocketId,
// //       firstName: player2.firstname,
// //       lastName: player2.lastname,
// //       username: player2.username,
// //       avatar: player2.avatar,
// //       roomId,
// //       player: new Paddle(GAME_WIDTH - 60),
// //     });

// //     game.state = "MATCHED";
// //     return game;
// //   }

// //   registerGame(game) {
// //     activeGames.set(game.roomId, game);

// //     const current = activeGames.get(game.roomId);
// //     if (!current || current.state !== "MATCHED") {
// //       activeGames.delete(game.roomId);
// //       return this.err("Failed to create match", 500);
// //     }

// //     return { ok: true, current };
// //   }

// //   startMatch(io, game, p1Socket, p2Socket) {
// //     p1Socket.join(game.roomId);
// //     p2Socket.join(game.roomId);

// //     game.state = "PLAYING";

// //     io.to(game.roomId).emit("match-started", { roomId: game.roomId });
// //     io.to(game.roomId).emit("match-data", game);

// //     setTimeout(() => {
// //       try {
// //         startGameLoop(io, game.roomId);
// //       } catch (_) {}
// //     }, 3000);
// //   }

// //   cleanupGame(game) {
// //     try {
// //       if (!game) return;
// //       activeGames?.delete?.(game.roomId);
// //     } catch (_) {}
// //   }

// // 	async onGameAccept(socket, io, data, ack) {
// // 		const ackFn = makeAck(ack);
// // 		const err = makeFail(ackFn);
// // 		let game = null;
	
// // 		try {
// // 			const notifId = parseNotifId(data, err);
// // 			if (!notifId) return;
	
// // 			const db = getDb(io, err);
// // 			if (!db) return;
	
// // 			const notification = await loadAndValidateNotification(db, notifId, err);
// // 			if (!notification) return;
	
// // 			const ids = authorizeReceiver(socket, notification, err);
// // 			if (!ids) return;
// // 			const { senderId, receiverId } = ids;
	
// // 			const roomId = resolveRoomId(notification);
	
// // 			const players = await loadPlayers(db, senderId, receiverId, err);
// // 			if (!players) return;
// // 			const { player1, player2 } = players;
	
// // 			const socketIds = resolveOnlineSocketIds(senderId, receiverId, err);
// // 			if (!socketIds) return;
// // 			const { p1SocketId, p2SocketId } = socketIds;
	
// // 			const live = getLiveSockets(io, p1SocketId, p2SocketId, err);
// // 			if (!live) return;
// // 			const { p1Socket, p2Socket } = live;
	
// // 			bindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId });
	
// // 			game = createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 });
	
// // 			const current = registerGame(game, err);
// // 			if (!current) {
// // 				cleanupGame(game);
// // 				return;
// // 			}
	
// // 			startMatch(io, game, p1Socket, p2Socket);
	
// // 			return ackFn({ ok: true, notification, message: "Success", roomId: game.roomId });
// // 		} catch (err) {
// // 			cleanupGame(game);
// // 			return ackFn({ ok: false, notification: null, message: err?.message || "Unknown error", code: 500 });
// // 		}
// // 	}
// // }

// // export const GameAcceptService = new GameAcceptService();




// import { onlineUsers, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js";
// import { isValidPlayerData, getGameByUsername } from "../utils/GameUtils.js";
// import { NotifServices } from "../services/Notification.service.js";
// import { GameSession, Paddle } from "../store/game.store.js";
// import { GAME_WIDTH } from "../constants/game.constants.js";
// import { startGameLoop } from "../utils/GameUtils.js";
// import { userModels } from "../models/user.model.js";

// import { randomUUID } from "crypto";

// class gameAcceptService {
//   err(message, code = 400) {
//     return { ok: false, notification: null, message, code };
//   }

//   safeAck(ack, payload) {
//     try {
//       ack?.(payload);
//     } catch (_) {}
//   }

//   parseNotifId(data) {
//     if (!data || typeof data !== "object") return this.err("Invalid payload");

//     const notifId = Number(data?.notifId);
//     if (!Number.isInteger(notifId) || notifId <= 0) return this.err("Invalid notifId");

//     return { ok: true, notifId };
//   }

//   getDb(io) {
//     const db = io?.db;
//     if (!db) return this.err("DB not attached to io", 500);
//     return { ok: true, db };
//   }

//   async loadAndValidateNotification(db, notifId) {
//     const notification = await NotifServices.getById(db, notifId);
		
		
//     if (!notification || typeof notification !== "object") { return this.err("Notification not found", 404);}
//     if (notification.type !== "game_invite") { return this.err("Notification type is not game_invite"); }
//     // if (notification.status !== "pending") { return this.err("Notification is not pending"); }
//     if (notification.is_expired) { return this.err("Notification expired"); }

//     return { ok: true, notification };
//   }

//   authorizeReceiver(socket, notification) {
//     const receiverId = Number(notification.receiver_id);
//     const senderId = Number(notification.sender_id);

//     if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) { return this.err("Notification has invalid sender/receiver"); }

//     const socketUserId = Number(socket?.user?.userId);
//     if (!Number.isInteger(socketUserId)) return this.err("Unauthenticated", 401);
//     if (socketUserId !== receiverId) { return this.err("Forbidden: not notification receiver", 403); }


//     return { ok: true, senderId, receiverId };
//   }

//   resolveRoomId(notification) {
//     const payloadRoomId = notification?.payload?.roomId;
//     const roomId = typeof payloadRoomId === "string" && payloadRoomId.trim().length > 0
//         ? payloadRoomId.trim() : randomUUID();

//     return roomId;
//   }

//   async loadPlayers(db, senderId, receiverId) {
//     const player1 = await userModels.getUserById(db, senderId);
//     const player2 = await userModels.getUserById(db, receiverId);
		
//     if (!isValidPlayerData(player1) || !isValidPlayerData(player2)) { return this.err("Invalid player data"); }
//     if (getGameByUsername(player1.username) || getGameByUsername(player2.username)) { return this.err("One of the players is already in a game", 409); }
//     if (usernameToSocket.has(player1.username) || usernameToSocket.has(player2.username)) { return this.err("One of the players is already in a game", 409); }

//     return { ok: true, player1, player2 };
//   }

//   resolveOnlineSocketIds(senderId, receiverId) {
//     const p1SocketId = onlineUsers?.get?.(senderId);
//     const p2SocketId = onlineUsers?.get?.(receiverId);

//     if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string") { return this.err("One of the players is offline", 409); }

//     return { ok: true, p1SocketId, p2SocketId };
//   }

//   getLiveSockets(io, p1SocketId, p2SocketId) {
//     const p1Socket = io.sockets.sockets.get(p1SocketId);
//     const p2Socket = io.sockets.sockets.get(p2SocketId);

//     if (!p1Socket || !p2Socket) return this.err("Player socket missing", 409);

//     return { ok: true, p1Socket, p2Socket };
//   }

//   bindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId }) {
//     usernameToSocket.set(player1.username, p1SocketId);
//     usernameToSocket.set(player2.username, p2SocketId);

//     socketToUsername.set(p1SocketId, player1.username);
//     socketToUsername.set(p2SocketId, player2.username);
//   }

//   unbindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId }) {
//       if (player1?.username) usernameToSocket.delete(player1.username);
//       if (player2?.username) usernameToSocket.delete(player2.username);
//       if (p1SocketId) socketToUsername.delete(p1SocketId);
//       if (p2SocketId) socketToUsername.delete(p2SocketId);
//   }

//   createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 }) {
//     const game = new GameSession();
//     game.roomId = roomId;

//     Object.assign(game.player1, {
//       id: senderId,
//       socketId: p1SocketId,
//       firstName: player1.firstname,
//       lastName: player1.lastname,
//       username: player1.username,
//       avatar: player1.avatar,
//       roomId,
//       player: new Paddle(40),
//     });

//     Object.assign(game.player2, {
//       id: receiverId,
//       socketId: p2SocketId,
//       firstName: player2.firstname,
//       lastName: player2.lastname,
//       username: player2.username,
//       avatar: player2.avatar,
//       roomId,
//       player: new Paddle(GAME_WIDTH - 60),
//     });

//     game.state = "MATCHED";
//     return game;
//   }

//   registerGame(game) {
//     activeGames.set(game.roomId, game);

//     const current = activeGames.get(game.roomId);
//     if (!current || current.state !== "MATCHED") {
//       activeGames.delete(game.roomId);
//       return this.err("Failed to create match", 500);
//     }

//     return { ok: true, current };
//   }

//   startMatch(io, game, p1Socket, p2Socket) {
//     p1Socket.join(game.roomId);
//     p2Socket.join(game.roomId);

//     game.state = "PLAYING";
		
//     io.to(game.roomId).emit("match-started", { roomId: game.roomId });
//     io.to(game.roomId).emit("match-data", game);
//     setTimeout(() => {startGameLoop(io, game.roomId);}, 3000);
//     // p1Socket.emit("match-data", game);
//     // p2Socket.emit("match-data", game);

//   }

//   cleanupGame(game) {
//     try {
//       if (!game) return;
//       activeGames?.delete?.(game.roomId);
//     } catch (_) {}
//   }

//   async onGameAccept(socket, io, data, ack) {
//     let game = null;

//     let bindInfo = null;

//     try {
//       const step1 = this.parseNotifId(data);
//       if (!step1.ok) return this.safeAck(ack, step1);
//       const { notifId } = step1;
			
//       const step2 = this.getDb(io);
//       if (!step2.ok) return this.safeAck(ack, step2);
//       const { db } = step2;
			
//       const step3 = await this.loadAndValidateNotification(db, notifId);
//       if (!step3.ok) return this.safeAck(ack, step3);
//       const { notification } = step3;
			
//       const step4 = this.authorizeReceiver(socket, notification);
//       if (!step4.ok) return this.safeAck(ack, step4);
//       const { senderId, receiverId } = step4;
			
//       const roomId = this.resolveRoomId(notification);
			
//       const step5 = await this.loadPlayers(db, senderId, receiverId);
//       if (!step5.ok) return this.safeAck(ack, step5);
//       const { player1, player2 } = step5;
			
//       const step6 = this.resolveOnlineSocketIds(senderId, receiverId);
//       if (!step6.ok) return this.safeAck(ack, step6);
//       const { p1SocketId, p2SocketId } = step6;
			
//       const step7 = this.getLiveSockets(io, p1SocketId, p2SocketId);
//       if (!step7.ok) return this.safeAck(ack, step7);
//       const { p1Socket, p2Socket } = step7;
			
//       bindInfo = { player1, player2, p1SocketId, p2SocketId };
//       this.bindUsernameSocketMaps(bindInfo);
			
//       game = this.createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 });
			
//       const step8 = this.registerGame(game);
//       if (!step8.ok) {
// 				this.cleanupGame(game);
//         if (bindInfo) this.unbindUsernameSocketMaps(bindInfo);
//         return this.safeAck(ack, step8);
//       }
			
//       this.startMatch(io, game, p1Socket, p2Socket);
// 			io.to(game.roomId).emit("match-data", game);
			
//       this.safeAck(ack, {
//         ok: true,
//         notification,
//         message: "Success",
//         roomId: game.roomId,
//       });
// 			return game;
//     } catch (err) {
//       this.cleanupGame(game);
//       if (bindInfo) this.unbindUsernameSocketMaps(bindInfo);

//       return this.safeAck(ack, {
//         ok: false,
//         notification: null,
//         message: err?.message || "Unknown error",
//         code: 500,
//       });
//     }
//   }
// }

// export const GameAcceptService = new gameAcceptService();
// import {
//   onlineUsers,
//   socketToUsername,
//   usernameToSocket,
//   activeGames,
// } from "../store/memory.store.js";

// import { isValidPlayerData, getGameByUsername } from "../utils/GameUtils.js";
// import { NotifServices } from "../services/Notification.service.js";
// import { GameSession, Paddle } from "../store/game.store.js";
// import { GAME_WIDTH } from "../constants/game.constants.js";
// import { startGameLoop } from "../utils/GameUtils.js";
// import { userModels } from "../models/user.model.js";

// import { randomUUID } from "crypto";

// class GameAcceptService {
//   // --- error object factory (does NOT call ack)
//   err(message, code = 400) {
//     return { ok: false, notification: null, message, code };
//   }

//   // --- small safe ack wrapper
//   safeAck(ack, payload) {
//     try {
//       ack?.(payload);
//     } catch (_) {}
//   }

//   parseNotifId(data) {
//     if (!data || typeof data !== "object") return this.err("Invalid payload");

//     const notifId = Number(data?.notifId);
//     if (!Number.isInteger(notifId) || notifId <= 0) return this.err("Invalid notifId");

//     return { ok: true, notifId };
//   }

//   getDb(io) {
//     const db = io?.db;
//     if (!db) return this.err("DB not attached to io", 500);
//     return { ok: true, db };
//   }

//   async loadAndValidateNotification(db, notifId) {
//     const notification = await NotifServices.getById(db, notifId);

//     if (!notification || typeof notification !== "object") {
//       return this.err("Notification not found", 404);
//     }

//     if (notification.type !== "game_invite") {
//       return this.err("Notification type is not game_invite");
//     }

//     if (notification.status !== "pending") {
//       return this.err("Notification is not pending");
//     }

//     if (notification.is_expired) {
//       return this.err("Notification expired");
//     }

//     return { ok: true, notification };
//   }

//   authorizeReceiver(socket, notification) {
//     const receiverId = Number(notification.receiver_id);
//     const senderId = Number(notification.sender_id);

//     if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) {
//       return this.err("Notification has invalid sender/receiver");
//     }

//     const socketUserId = Number(socket?.user?.userId);
//     if (!Number.isInteger(socketUserId)) return this.err("Unauthenticated", 401);

//     if (socketUserId !== receiverId) {
//       return this.err("Forbidden: not notification receiver", 403);
//     }

//     return { ok: true, receiverId, senderId };
//   }

//   resolveRoomId(notification) {
//     const payloadRoomId = notification?.payload?.roomId;
//     const roomId =
//       typeof payloadRoomId === "string" && payloadRoomId.trim().length > 0
//         ? payloadRoomId.trim()
//         : randomUUID();

//     return roomId;
//   }

//   async loadPlayers(db, senderId, receiverId) {
//     const player1 = await userModels.getUserById(db, senderId);
//     const player2 = await userModels.getUserById(db, receiverId);

//     if (!isValidPlayerData(player1) || !isValidPlayerData(player2)) {
//       return this.err("Invalid player data");
//     }

//     if (getGameByUsername(player1.username) || getGameByUsername(player2.username)) {
//       return this.err("One of the players is already in a game", 409);
//     }

//     // Keep your original logic: if username is already bound, reject
//     if (usernameToSocket.has(player1.username) || usernameToSocket.has(player2.username)) {
//       return this.err("One of the players is already in a game", 409);
//     }

//     return { ok: true, player1, player2 };
//   }

//   resolveOnlineSocketIds(senderId, receiverId) {
//     const p1SocketId = onlineUsers?.get?.(senderId);
//     const p2SocketId = onlineUsers?.get?.(receiverId);

//     if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string") {
//       return this.err("One of the players is offline", 409);
//     }

//     return { ok: true, p1SocketId, p2SocketId };
//   }

//   getLiveSockets(io, p1SocketId, p2SocketId) {
//     const p1Socket = io.sockets.sockets.get(p1SocketId);
//     const p2Socket = io.sockets.sockets.get(p2SocketId);

//     if (!p1Socket || !p2Socket) return this.err("Player socket missing", 409);

//     return { ok: true, p1Socket, p2Socket };
//   }

//   bindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId }) {
//     usernameToSocket.set(player1.username, p1SocketId);
//     usernameToSocket.set(player2.username, p2SocketId);

//     socketToUsername.set(p1SocketId, player1.username);
//     socketToUsername.set(p2SocketId, player2.username);
//   }

//   createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 }) {
//     const game = new GameSession();
//     game.roomId = roomId;

//     Object.assign(game.player1, {
//       id: senderId,
//       socketId: p1SocketId,
//       firstName: player1.firstname,
//       lastName: player1.lastname,
//       username: player1.username,
//       avatar: player1.avatar,
//       roomId,
//       player: new Paddle(40),
//     });

//     Object.assign(game.player2, {
//       id: receiverId,
//       socketId: p2SocketId,
//       firstName: player2.firstname,
//       lastName: player2.lastname,
//       username: player2.username,
//       avatar: player2.avatar,
//       roomId,
//       player: new Paddle(GAME_WIDTH - 60),
//     });

//     game.state = "MATCHED";
//     return game;
//   }

//   registerGame(game) {
//     activeGames.set(game.roomId, game);

//     const current = activeGames.get(game.roomId);
//     if (!current || current.state !== "MATCHED") {
//       activeGames.delete(game.roomId);
//       return this.err("Failed to create match", 500);
//     }

//     return { ok: true, current };
//   }

//   startMatch(io, game, p1Socket, p2Socket) {
//     p1Socket.join(game.roomId);
//     p2Socket.join(game.roomId);

//     game.state = "PLAYING";

//     io.to(game.roomId).emit("match-started", { roomId: game.roomId });
//     io.to(game.roomId).emit("match-data", game);

//     setTimeout(() => {
//       try {
//         startGameLoop(io, game.roomId);
//       } catch (_) {}
//     }, 3000);
//   }

//   cleanupGame(game) {
//     try {
//       if (!game) return;
//       activeGames?.delete?.(game.roomId);
//     } catch (_) {}
//   }

// 	async onGameAccept(socket, io, data, ack) {
// 		const ackFn = makeAck(ack);
// 		const err = makeFail(ackFn);
// 		let game = null;
	
// 		try {
// 			const notifId = parseNotifId(data, err);
// 			if (!notifId) return;
	
// 			const db = getDb(io, err);
// 			if (!db) return;
	
// 			const notification = await loadAndValidateNotification(db, notifId, err);
// 			if (!notification) return;
	
// 			const ids = authorizeReceiver(socket, notification, err);
// 			if (!ids) return;
// 			const { senderId, receiverId } = ids;
	
// 			const roomId = resolveRoomId(notification);
	
// 			const players = await loadPlayers(db, senderId, receiverId, err);
// 			if (!players) return;
// 			const { player1, player2 } = players;
	
// 			const socketIds = resolveOnlineSocketIds(senderId, receiverId, err);
// 			if (!socketIds) return;
// 			const { p1SocketId, p2SocketId } = socketIds;
	
// 			const live = getLiveSockets(io, p1SocketId, p2SocketId, err);
// 			if (!live) return;
// 			const { p1Socket, p2Socket } = live;
	
// 			bindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId });
	
// 			game = createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 });
	
// 			const current = registerGame(game, err);
// 			if (!current) {
// 				cleanupGame(game);
// 				return;
// 			}
	
// 			startMatch(io, game, p1Socket, p2Socket);
	
// 			return ackFn({ ok: true, notification, message: "Success", roomId: game.roomId });
// 		} catch (err) {
// 			cleanupGame(game);
// 			return ackFn({ ok: false, notification: null, message: err?.message || "Unknown error", code: 500 });
// 		}
// 	}
// }

// export const GameAcceptService = new GameAcceptService();




import { onlineUsers, socketToUsername, usernameToSocket, activeGames } from "../store/memory.store.js";
import { isValidPlayerData, getGameByUsername } from "../utils/GameUtils.js";
import { NotifServices } from "../services/Notification.service.js";
import { GameSession, Paddle } from "../store/game.store.js";
import { GAME_WIDTH } from "../constants/game.constants.js";
import { startGameLoop } from "../utils/GameUtils.js";
import { userModels } from "../models/user.model.js";

import { randomUUID } from "crypto";

class gameAcceptService {
  err(message, code = 400) {
    return { ok: false, notification: null, message, code };
  }

  safeAck(ack, payload) {
    try {
      ack?.(payload);
    } catch (_) {}
  }

  parseNotifId(data) {
    if (!data || typeof data !== "object") return this.err("Invalid payload");

    const notifId = Number(data?.notifId);
    if (!Number.isInteger(notifId) || notifId <= 0) return this.err("Invalid notifId");

    return { ok: true, notifId };
  }

  getDb(io) {
    const db = io?.db;
    if (!db) return this.err("DB not attached to io", 500);
    return { ok: true, db };
  }

  async loadAndValidateNotification(db, notifId) {
    const notification = await NotifServices.getById(db, notifId);
		
		
    if (!notification || typeof notification !== "object") { return this.err("Notification not found", 404);}
    if (notification.type !== "game_invite") { return this.err("Notification type is not game_invite"); }
    // if (notification.status !== "pending") { return this.err("Notification is not pending"); }
    if (notification.is_expired) { return this.err("Notification expired"); }

    return { ok: true, notification };
  }

  authorizeReceiver(socket, notification) {
    const receiverId = Number(notification.receiver_id);
    const senderId = Number(notification.sender_id);

    if (!Number.isInteger(receiverId) || !Number.isInteger(senderId)) { return this.err("Notification has invalid sender/receiver"); }

    const socketUserId = Number(socket?.user?.userId);
    if (!Number.isInteger(socketUserId)) return this.err("Unauthenticated", 401);
    if (socketUserId !== receiverId) { return this.err("Forbidden: not notification receiver", 403); }


    return { ok: true, senderId, receiverId };
  }

  resolveRoomId(notification) {
    const payloadRoomId = notification?.payload?.roomId;
    const roomId = typeof payloadRoomId === "string" && payloadRoomId.trim().length > 0
        ? payloadRoomId.trim() : randomUUID();

    return roomId;
  }

  async loadPlayers(db, senderId, receiverId) {
    const player1 = await userModels.getUserById(db, senderId);
    const player2 = await userModels.getUserById(db, receiverId);
		
    if (!isValidPlayerData(player1) || !isValidPlayerData(player2)) { return this.err("Invalid player data"); }
    if (getGameByUsername(player1.username) || getGameByUsername(player2.username)) { return this.err("One of the players is already in a game", 409); }
    if (usernameToSocket.has(player1.username) || usernameToSocket.has(player2.username)) { return this.err("One of the players is already in a game", 409); }

    return { ok: true, player1, player2 };
  }

  resolveOnlineSocketIds(senderId, receiverId) {
    const p1SocketId = onlineUsers?.get?.(senderId);
    const p2SocketId = onlineUsers?.get?.(receiverId);

    if (typeof p1SocketId !== "string" || typeof p2SocketId !== "string") { return this.err("One of the players is offline", 409); }

    return { ok: true, p1SocketId, p2SocketId };
  }

  getLiveSockets(io, p1SocketId, p2SocketId) {
    const p1Socket = io.sockets.sockets.get(p1SocketId);
    const p2Socket = io.sockets.sockets.get(p2SocketId);

    if (!p1Socket || !p2Socket) return this.err("Player socket missing", 409);

    return { ok: true, p1Socket, p2Socket };
  }

  bindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId }) {
    usernameToSocket.set(player1.username, p1SocketId);
    usernameToSocket.set(player2.username, p2SocketId);

    socketToUsername.set(p1SocketId, player1.username);
    socketToUsername.set(p2SocketId, player2.username);
  }

  unbindUsernameSocketMaps({ player1, player2, p1SocketId, p2SocketId }) {
      if (player1?.username) usernameToSocket.delete(player1.username);
      if (player2?.username) usernameToSocket.delete(player2.username);
      if (p1SocketId) socketToUsername.delete(p1SocketId);
      if (p2SocketId) socketToUsername.delete(p2SocketId);
  }

  createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 }) {
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
    return game;
  }

  registerGame(game) {
    activeGames.set(game.roomId, game);

    const current = activeGames.get(game.roomId);
    if (!current || current.state !== "MATCHED") {
      activeGames.delete(game.roomId);
      return this.err("Failed to create match", 500);
    }

    return { ok: true, current };
  }

  startMatch(io, game, p1Socket, p2Socket) {
    p1Socket.join(game.roomId);
    p2Socket.join(game.roomId);

    game.state = "PLAYING";
		
    io.to(game.roomId).emit("match-started", { roomId: game.roomId });
    io.to(game.roomId).emit("match-data", game);
    setTimeout(() => {startGameLoop(io, game.roomId);}, 3000);
    // p1Socket.emit("match-data", game);
    // p2Socket.emit("match-data", game);

  }

  cleanupGame(game) {
    try {
      if (!game) return;
      activeGames?.delete?.(game.roomId);
    } catch (_) {}
  }

  async onGameAccept(socket, io, data, ack) {
    let game = null;

    let bindInfo = null;

    try {
      const step1 = this.parseNotifId(data); //     [x]
      if (!step1.ok) return this.safeAck(ack, step1);
      const { notifId } = step1;
			
      const step2 = this.getDb(io); //     [x]
      if (!step2.ok) return this.safeAck(ack, step2);
      const { db } = step2;
			
      const step3 = await this.loadAndValidateNotification(db, notifId); //     [x]
      if (!step3.ok) return this.safeAck(ack, step3);
      const { notification } = step3;
			
      const step4 = this.authorizeReceiver(socket, notification); //     [x]
      if (!step4.ok) return this.safeAck(ack, step4);
      const { senderId, receiverId } = step4;
			
      const roomId = this.resolveRoomId(notification); //     [x]
			
      const step5 = await this.loadPlayers(db, senderId, receiverId);
      if (!step5.ok) return this.safeAck(ack, step5);
      const { player1, player2 } = step5;
			
      const step6 = this.resolveOnlineSocketIds(senderId, receiverId);
      if (!step6.ok) return this.safeAck(ack, step6);
      const { p1SocketId, p2SocketId } = step6;
			
      const step7 = this.getLiveSockets(io, p1SocketId, p2SocketId);
      if (!step7.ok) return this.safeAck(ack, step7);
      const { p1Socket, p2Socket } = step7;
			
      bindInfo = { player1, player2, p1SocketId, p2SocketId };
      this.bindUsernameSocketMaps(bindInfo);
			
      game = this.createGameSession({ roomId, senderId, receiverId, p1SocketId, p2SocketId, player1, player2 });
			
      const step8 = this.registerGame(game);
      if (!step8.ok) {
				this.cleanupGame(game);
        if (bindInfo) this.unbindUsernameSocketMaps(bindInfo);
        return this.safeAck(ack, step8);
      }
			
      this.startMatch(io, game, p1Socket, p2Socket);
			io.to(game.roomId).emit("match-data", game);
			
      this.safeAck(ack, {
        ok: true,
        notification,
        message: "Success",
        roomId: game.roomId,
      });
			return game;
    } catch (err) {
      this.cleanupGame(game);
      if (bindInfo) this.unbindUsernameSocketMaps(bindInfo);

      return this.safeAck(ack, {
        ok: false,
        notification: null,
        message: err?.message || "Unknown error",
        code: 500,
      });
    }
  }
}

export const GameAcceptService = new gameAcceptService();
