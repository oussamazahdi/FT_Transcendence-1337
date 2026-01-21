import { NOTIFICATION_TYPES } from "../rules/notifications.rules.js";

export class NotifModel {
  async create(db, { senderId, receiverId, type, title, message, payload = null, expiresAt = null }) {
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) return null;
    console.log("all types: ",typeof senderId, typeof receiverId, typeof type, typeof title, typeof message, typeof payload, typeof expiresAt)
    const safeExpiresAt = expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt ?? null;

    const res = db.prepare(
        `INSERT INTO notifications(sender_id, receiver_id, type, title, message, payload, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(senderId, receiverId, type, title, message, payload, safeExpiresAt);
    return { id: res.lastInsertRowid };
  }

  async getById(db, id) {
    return db.prepare(`SELECT * FROM notifications WHERE id = ?`).get(id);
  }

  async updateStatus(db, id, status) {
    return db.prepare(`UPDATE notifications SET status = ? WHERE id = ?`).run(status, id);
  }

  async markAsRead(db, id) {
    return db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ?`).run(id);
  }

  async markAsExpired(db, id) {
    return db.prepare(`UPDATE notifications SET is_expired = 1 WHERE id = ?`).run(id);
  }

  async getForUser(db, userId) {
    return db.prepare(`SELECT * FROM notifications WHERE receiver_id = ? ORDER BY created_at DESC`).all(userId);
  }

	updateNotificationStatus(db, { notifId, status, isRead = 1 }) {
		const prepared = db.prepare(`UPDATE notifications SET status = ?, is_read = ? WHERE id = ?`);
		return prepared.run(status, isRead, notifId);
	}

	getNotificationById(db, notifId) {
		return db.prepare(`SELECT * FROM notifications WHERE id = ?`).get(notifId);
	}
}
