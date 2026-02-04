import { MatchHistory } from "../models/matchHistory.model.js";
import { GameSetting } from "../models/gameSetting.model.js";

export function httpError(code, message) {
	const err = new Error(message);
	err.code = code;
	return err;
}

class matchController {

	async createMatchHistory(db, { player1, player2, score1, score2, winner = null, status = "finished" }) {
		const inserted = await MatchHistory.create(db, { player1, player2, score1, score2, winner, status,
		});

		if (!inserted?.id) throw httpError(500, "Failed to create match history");

		return inserted;
	}

	async getMatchHistoryByUserId(db, userId) {
		if (!userId) throw httpError(400, "userId is required");

		return MatchHistory.getByUserId(db, userId);
	}

	async addNewGameSettings(db, userId) {
		try {
			const result = await GameSetting.addNewUserSetting(db, { userId });
	
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
      const settings = await GameSetting.getUserSettings(db, userId);
      return settings;
    } catch (error) {
      throw error;
    }
  }

  async updateUserSettings( db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size, }) {
    try {
      const result = await GameSetting.updateUserSettings(db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size,});
      return result;

    } catch (error) {
      throw error;
    }
  }

  async updateUserXpAndLevel( db, { userId, status }) {
    try {
      const result = await GameSetting.updateUserXpAndLevel(db, { userId, status});
      return result;

    } catch (error) {
      throw error;
    }
  }
	
}
export const MatchController = new matchController();