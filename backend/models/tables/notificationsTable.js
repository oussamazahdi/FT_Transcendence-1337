import { handleDatabaseError } from '../../utils/dbErrorHandler.js';

export function createNotificationsTable(db) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        payload TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        is_read INTEGER NOT NULL DEFAULT 0,
        expires_at DATETIME,
        is_expired INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (sender_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
  } catch (error) {
    const dbError = handleDatabaseError(error, 'createNotificationsTable');
    console.error(dbError);
    process.exit(1);
  }
}
