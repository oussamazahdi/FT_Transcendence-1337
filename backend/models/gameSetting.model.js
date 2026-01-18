import { handleDatabaseError } from "../utils/dbErrorHandler.js";

export class GameSetting {
  async addNewUserSetting(db, { userId }) {
    try {
      db.prepare(`INSERT INTO game_settings (player_id, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(userId, 0, 0, "hell", 2, 10, 2);
    } catch (error) {
      const dbError = handleDatabaseError(error, "addNewUserSetting");
      throw dbError;
    }
  }

  async getUserSettings(db, userId) {
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

  async updateUserSettings(db,{ userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size,}) {
		try {
			const result = db.prepare(`UPDATE game_settings SET player_xp = ?, player_level = ?, game_mode = ?, ball_speed = ?, score_limit = ?, paddle_size = ? WHERE player_id = ?`)
				.run( player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size, userId);
	
			if (result.changes === 0) {
				throw { code: 404, message: "USER_SETTINGS_NOT_FOUND" };
			}
	
			return { success: true };
		} catch (error) {
			if (error?.code === 404) throw error;
			const dbError = handleDatabaseError(error, "updateUserSettings");
			throw dbError;
		}
	}
}
