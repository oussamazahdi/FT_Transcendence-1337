import { handleDatabaseError } from '../../utils/dbErrorHandler.js';

export function createGameSettingTable(db) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS game_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        player_xp INTEGER DEFAULT 0,
        player_level REAL DEFAULT 0,
        game_mode TEXT NOT NULL DEFAULT 'hell',
        ball_speed INTEGER NOT NULL,
        score_limit INTEGER NOT NULL,
        paddle_size INTEGER NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);
  } catch (error) {
    console.error("Database cannot be inited due to : " + error.message);
    process.exit(1);
  }
}
