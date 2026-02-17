import { handleDatabaseError } from "../utils/dbErrorHandler.js";

class gameSetting {
  async addNewUserSetting(db, { userId }) {
    try {
      db.prepare(`INSERT INTO game_settings (player_id, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(userId, 0, 0, "hell", 2, 10, 2);
    } catch (error) {
      const dbError = handleDatabaseError(error, "addNewUserSetting");
      throw dbError;
    }
  }

   getUserSettings(db, userId) {
    try {
      const settings = db.prepare("SELECT * FROM game_settings WHERE player_id = ?").get(userId);

      if (!settings) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      return settings;
    } catch (error) {
      if (error?.code === 404) throw error;
      const dbError = handleDatabaseError(error, "getUserSettings");
      throw dbError;
    }
  }

  async updateUserSettings(db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size }) {
		try {
			const toNull = (v) => (v === undefined ? null : v);
	
			const prepared = db.prepare(`UPDATE game_settings SET
					player_xp    = COALESCE(?, player_xp),
					player_level = COALESCE(?, player_level),
					game_mode    = COALESCE(?, game_mode),
					ball_speed   = COALESCE(?, ball_speed),
					score_limit  = COALESCE(?, score_limit),
					paddle_size  = COALESCE(?, paddle_size),
					updated_at   = CURRENT_TIMESTAMP
				WHERE player_id = ?;
			`);
	
			const result = prepared.run(
				toNull(player_xp),
				toNull(player_level),
				toNull(game_mode),
				toNull(ball_speed),
				toNull(score_limit),
				toNull(paddle_size),
				userId
			);
	
			if (result.changes === 0) {
				const exists = db.prepare(`SELECT 1 FROM game_settings WHERE player_id = ?`).get(userId);
				if (!exists) throw { code: 404, message: "USER_SETTINGS_NOT_FOUND" };
			}
	
			return { success: true };
		} catch (error) {
			if (error?.code === 404) throw error;
			throw handleDatabaseError(error, "updateUserSettings");
		}
	}
	
	async updateUserXpAndLevel(db, { userId, status }) {
		try {
			if (!Number.isInteger(userId) || userId <= 0) throw { code: 400, message: "INVALID_USER_ID" };
	
			let prepared;
	
			if (status === "winner") {
				prepared = db.prepare(`UPDATE game_settings SET player_xp = player_xp + 100,
					player_level = player_level + 0.04,
					updated_at = CURRENT_TIMESTAMP
					WHERE player_id = ?`);

			} else if (status === "loser") {
				prepared = db.prepare(`UPDATE game_settings SET player_xp = CASE
					WHEN player_xp - 60 < 0 THEN 0
					ELSE player_xp - 60
				END, player_level = CASE
					WHEN player_level - 0.032 < 0 THEN 0
					ELSE ROUND(player_level - 0.032, 2)
				END, updated_at = CURRENT_TIMESTAMP
					WHERE player_id = ?`);

			} else {
				throw { code: 400, message: "INVALID_STATUS" };
			}

			const result = prepared.run(userId);
	
			if (result.changes === 0) {
				const exists = db.prepare(`SELECT 1 FROM game_settings WHERE player_id = ?`).get(userId);
				if (!exists) throw { code: 404, message: "USER_SETTINGS_NOT_FOUND" };
			}
	
			return { ok: true };
		} catch (error) {
			if (error?.code === 400 || error?.code === 404) throw error;
			throw handleDatabaseError(error, "updateUserXpAndLevel");
		}
	}
	
}

export const GameSetting = new gameSetting();
