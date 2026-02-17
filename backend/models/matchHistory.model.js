import { handleDatabaseError } from "../utils/dbErrorHandler.js";

class matchHistory {
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

	 getByUserId(db, userId) {
		try {
			const result = db.prepare(`SELECT
								u1.id AS player1_id,
								u1.username AS player1_username,
								u1.avatar AS player1_avatar,
								u2.id AS player2_id,
								u2.username AS player2_username,
								u2.avatar AS player2_avatar,
								mh.winner_id,
								mh.player1_score,
								mh.player2_score,
								mh.created_at,
								mh.id
							FROM match_history mh
							JOIN users u1 ON u1.id = mh.player1_id
							JOIN users u2 ON u2.id = mh.player2_id
							WHERE (mh.player1_id = :me OR mh.player2_id = :me)
							ORDER BY 
								mh.created_at DESC`).all({me: userId});
			return (result)
		} catch (error) {
			throw handleDatabaseError(error);
		}
	}
}


export const MatchHistory = new matchHistory()