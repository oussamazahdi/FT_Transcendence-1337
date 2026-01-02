function createFriendshipTable(db)
{
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            reciever_id INTEGER NOT NULL,
            status TEXT NOT NULL CHECK (
                status IN ('pending', 'accepted', 'blocked')
            ),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(sender_id, reciever_id)
            )`)
    }
    catch {
        console.error("Database cannot be inited due to : " + error.message);
        process.exit(1);
    }
}

export {createFriendshipTable}