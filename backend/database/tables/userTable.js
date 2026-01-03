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
						secret2fa TEXT,
						createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
						)`);
				// console.log("Database initialized successfully!")
		}
		catch (error) {
				console.error("Database cannot be inited due to : " + error.message);
				process.exit(1);
		}
}

export { createUserTable };