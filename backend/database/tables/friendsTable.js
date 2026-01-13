function createFriendshipTable(db)
{
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            status TEXT NOT NULL CHECK (
                status IN ('pending', 'accepted', 'blocked')
            ),
            blocked_by INTEGER DEFAULT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(sender_id, receiver_id)
            )`)
    }
    catch (error) {
        console.error("Database cannot be inited due to : " + error.message);
        process.exit(1);
    }
}

export {createFriendshipTable}