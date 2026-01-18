import { MatchHistory } from "../models/matchHistory.model.js";
import { GameSetting } from "../models/gameSetting.model.js";

export function httpError(code, message) {
	const err = new Error(message);
	err.code = code;
	return err;
}

export class MatchController {
	constructor() {
		this.matchHistory = new MatchHistory();
		this.gameSetting = new GameSetting();
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

	async addNewGameSettings(db, userId) {
		try {
			const result = await this.gameSetting.addNewUserSetting(db, { userId });
	
			return {
				success: true,
				message: "GAME_SETTINGS_CREATED",
				data: result,
			};
		} catch (error) {
			throw error;
		}
	}

	async getUserSettings(db, userId) {
    try {
      const settings = await this.gameSetting.getUserSettings(db, userId);
      return settings;
    } catch (error) {
      throw error;
    }
  }

  updateUserSettings(db, {userId,player_xp,player_level,game_mode,ball_speed,score_limit,paddle_size}) {
		return this.gameSetting.updateUserSettings(db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size });
	}
	
	
	
}
