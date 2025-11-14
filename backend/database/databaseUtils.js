function initDatabase(db)
{
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT,
            lastname TEXT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            profilepicture TEXT,
            createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        console.log("Database initialized successfully!")
    }
    catch (error) {
        console.error("Database cannot be inited due to : " + error.message);
        process.exit(1);
    }
}

export { initDatabase };









// database/databaseUtils.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db = null;

// Initialize database connection
function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(
      path.join(__dirname, '../database.db'), 
      (err) => {
        if (err) {
          console.error('Error opening database:', err);
        } else {
          console.log('Connected to SQLite database');
        }
      }
    );
  }
  return db;
}

// Initialize database tables
function initDatabase() {
  const db = getDatabase();
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      image_path TEXT,
      avatar_type TEXT DEFAULT 'custom',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table ready');
    }
  });
}

// Close database connection
function closeDatabase(callback) {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
      if (callback) callback();
    });
  }
}

// Promisified database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  getDatabase,
  initDatabase,
  closeDatabase,
  dbRun,
  dbGet,
  dbAll
};