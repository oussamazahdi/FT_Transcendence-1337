function createTokenTable(db)
{
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            refresh_token TEXT NOT NULL UNIQUE,
            creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);
    }
    catch (error) {
        console.error("Database cannot be inited due to : " + error.message);
        process.exit(1);
    }
}

export { createTokenTable };