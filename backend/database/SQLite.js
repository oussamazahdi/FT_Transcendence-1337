import Database from "better-sqlite3";

const db = new Database('auth.db');

db.exec(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        profileImage TEXT,
        username STRING NOT NULL UNIQUE,
        email STRING NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
);

export default db;