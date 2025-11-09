import Database from "better-sqlite3";

const db = new Database('auth.db');

db.exec(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        firstname STRING NOT NULL,
        lastname STRING NOT NULL,
        username STRING NOT NULL UNIQUE,
        email STRING NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
);

export default db;