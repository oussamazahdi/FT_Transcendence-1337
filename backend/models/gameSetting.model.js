import { handleDatabaseError } from "../utils/dbErrorHandler.js";

export class GameSetting {

   addNewUserSetting(db, { userId }) {
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

  updateUserSettings(db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size }) {
		try {
			const toNull = (v) => (v === undefined ? null : v);
	
			const prepared = db.prepare(`
				UPDATE game_settings SET
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
	
}
