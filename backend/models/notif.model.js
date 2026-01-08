import { NOTIFICATION_TYPES } from "../rules/notifications.rules.js";

export class NotifModel {
	async create(db, data) {
		if (!NOTIFICATION_TYPES.includes(data.type)) return null;
		const res = db.prepare(`INSERT INTO notifications (sender_id, receiver_id, type, title, message, payload, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
			.run( data.senderId, data.receiverId, data.type, data.title, data.message, data.payload, data.expiresAt);
		return { id: res.lastInsertRowid };
	}

	async getById(db, id) {
		return db.prepare(`SELECT * FROM notifications WHERE id = ?`).get(id);
	}

	async getForUser(db, userId) {
		return db.prepare(`
			SELECT * FROM notifications
			WHERE receiver_id = ?
			ORDER BY created_at DESC
		`).all(userId);
	}

	async updateStatus(db, id, status) {
		return db.prepare(`UPDATE notifications SET status = ? WHERE id = ?`).run(status, id);
	}

	async markAsRead(db, id) {
		return db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ?`).run(id);
	}
}










// import { NOTIFICATION_TYPES } from "../rules/notifications.rules";

// export class NotifModel {
// 	create(db, { senderId, receiverId, type, title, message, payload = null, expiresAt = null }) {
// 		try{
// 			if (!NOTIFICATION_TYPES.includes(type)) return null;
// 			const execQuery = db.prepare(`INSERT INTO notifications(sender_id, receiver_id, type, title, message, payload, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);
// 			const result = execQuery.run(senderId, receiverId, type, title, message, payload, expiresAt);
// 			return {id: result.lastInsertRowid, senderId, receiverId, type, title, message, payload, expiresAt};

// 		} catch(error) {
// 			console.error("Error: Notif Model:", error);
// 			process.exit(1);
// 		}
// 	}
	
// 	getById(db, id) {
// 		try {
// 			return db.prepare(`SELECT * FROM notifications WHERE id = ?`).get(id);

// 		} catch(error) {
// 			console.error("Error: Notif Model:", error);
// 			process.exit(1);
// 		}
// 	}
	
// 	updateStatus(db, id, status){
// 		try {
// 			return db.prepare(`UPDATE notifications SET status = ? WHERE id = ?`).run(status,id);
	
// 		} catch(error) {
// 			console.error("Error: Notif Model:", error);
// 			process.exit(1);
// 		}
// 	}

// 	markAsRead(db, id){
// 		try {
// 			return db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ?`).run(id);
	
// 		} catch(error) {
// 			console.error("Error: Notif Model:", error);
// 			process.exit(1);
// 		}
// 	}
	
// 	getForUser(db, userId){
// 		try {
// 			return db.prepare(`SELECT * FROM notifications WHERE receiver_id = ? ORDER BY created_at DESC`).all(userId);
	
// 		} catch(error) {
// 			console.error("Error: Notif Model:", error);
// 			process.exit(1);
// 		}
// 	}
// }
