function initDatabase(db)
{
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT,
        lastname TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        profilePicture TEXT DEFAULT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (error) => {
            if (error)
                console.error(error.message);
        });
}


export { initDatabase };