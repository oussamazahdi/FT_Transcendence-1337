import { handleDatabaseError } from "../utils/dbErrorHandler.js";

export class MatchHistory {
	async create(db, { player1, player2, score1, score2, winner, status }) {
		try {
			const prepared = db.prepare(
				`INSERT INTO match_history (player1_id, player2_id, player1_score, player2_score, winner_id, status)
				 VALUES (?, ?, ?, ?, ?, ?)`
			);
			const info = prepared.run(player1, player2, score1, score2, winner ?? null, status);
			return { id: info.lastInsertRowid };
		} catch (error) {
			throw handleDatabaseError(error);
		}
	}

	async getByUserId(db, userId) {
		try {
			return (db.prepare(`SELECT * FROM match_history WHERE player1_id = ? OR player2_id = ? ORDER BY created_at DESC`).all(userId, userId));
		} catch (error) {
			throw handleDatabaseError(error);
		}
	}
}
