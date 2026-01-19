import { handleDatabaseError } from '../../utils/dbErrorHandler.js';

function createChatTable(db)
{
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            friend_id INTEGER,
            last_message TEXT,
            updatedate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            UNIQUE(user_id, friend_id)
            )`)

        db.exec(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            sender_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            FOREIGN KEY conversation_id REFERENCES conversations(id),
            FOREIGN KEY sender_id REFERENCES users(id),
            )`)
    }
    catch (error) {
        const dbError = handleDatabaseError(error, 'createChatTable');
        console.error(dbError);
        process.exit(1);
    }
}

export {createFriendshipTable}