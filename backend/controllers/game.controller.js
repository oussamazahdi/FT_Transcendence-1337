import { MatchHistory } from "../models/matchHistory.model.js";

export function httpError(code, message) {
	const err = new Error(message);
	err.code = code;
	return err;
}

export class MatchController {
	constructor() {
		this.matchHistory = new MatchHistory();
	}

	async createMatchHistory(db, { player1, player2, score1, score2, winner = null, status = "finished" }) {
		const inserted = await this.matchHistory.create(db, { player1, player2, score1, score2, winner, status,
		});

		if (!inserted?.id) throw httpError(500, "Failed to create match history");

		return inserted;
	}

	async getMatchHistoryByUserId(db, userId) {
		if (!userId) throw httpError(400, "userId is required");

		return this.matchHistory.getByUserId(db, userId);
	}
}
