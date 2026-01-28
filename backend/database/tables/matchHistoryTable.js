import { handleDatabaseError } from '../../utils/dbErrorHandler.js';

export function createMatchHistoryTable(db) {
	try {
		db.exec(`
		CREATE TABLE IF NOT EXISTS match_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			player1_id INTEGER NOT NULL,
			player2_id INTEGER NOT NULL,
			winner_id INTEGER NOT NULL,
			player1_score INTEGER NOT NULL,
			player2_score INTEGER NOT NULL,
			status TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			
			UNIQUE(player1_id, player2_id),

			FOREIGN KEY (player1_id) REFERENCES users(id) ON UPDATE CASCADE,
			FOREIGN KEY (player2_id) REFERENCES users(id) ON UPDATE CASCADE
			FOREIGN KEY (winner_id) REFERENCES users(id) ON UPDATE CASCADE
		);
		`);
	} catch (error) {
		console.error("Database cannot be inited due to : " + error.message);
		process.exit(1);
	}
}
