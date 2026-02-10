import { handleDatabaseError } from '../../utils/dbErrorHandler.js';

function createUserTable(db)
{
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            google_id TEXT UNIQUE,
            firstname TEXT,
            lastname TEXT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            avatar TEXT,
            isverified BOOLEAN DEFAULT false,
            otp TEXT,
            otpexpiration TIMESTAMP,
            status2fa BOOLEAN DEFAULT false,
            session2fa BOOLEAN DEFAULT false,
            secret2fa TEXT,
            createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

        const columns = db.prepare("PRAGMA table_info(users)").all();
        const columnNames = new Set(columns.map((col) => col.name));
        if (!columnNames.has("session2fa")) {
            db.exec("ALTER TABLE users ADD COLUMN session2fa BOOLEAN DEFAULT false");
        }
    }
    catch (error) {
        const dbError = handleDatabaseError(error, 'createUserTable');
        console.error(dbError);
        process.exit(1);
    }
}

export { createUserTable };
