import { MatchHistory } from "../models/matchHistory.model.js";
import { GameSetting } from "../models/gameSetting.model.js";
import { activeGames } from "../store/memory.store.js";


export function httpError(code, message) {
	const err = new Error(message);
	err.code = code;
	return err;
}

class matchController {

	createMatchHistory = async (db, { player1, player2, score1, score2, winner = null, status = "win" }) => {
		const inserted = await MatchHistory.create(db, { player1, player2, score1, score2, winner, status,
		});

		if (!inserted?.id) throw httpError(500, "Failed to create match history");

		return inserted;
	}

	getMatchHistoryByUserId = async (db, userId) => {
		if (!userId) throw httpError(400, "userId is required");

		return MatchHistory.getByUserId(db, userId);
	}

	addNewGameSettings = async (db, userId) => {
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

	getUserSettings = async (db, userId) => {
    try {
      const settings = await GameSetting.getUserSettings(db, userId);
      return settings;
    } catch (error) {
      throw error;
    }
  }

  updateUserSettings = async ( db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size, }) => {
    try {
      const result = await GameSetting.updateUserSettings(db, { userId, player_xp, player_level, game_mode, ball_speed, score_limit, paddle_size,});
      return result;

    } catch (error) {
      throw error;
    }
  }

  updateUserXpAndLevel = async ( db, { userId, status }) => {
    try {
      const result = await GameSetting.updateUserXpAndLevel(db, { userId, status});
      return result;

    } catch (error) {
      throw error;
    }
  }

	MatchHistory = async (req, res) => {
		try {
			const db = req.server.db;
			const { id } = req.query
			
			const data = await this.getMatchHistoryByUserId(db, id);

			return res.code(200).send({ message: "SUCCESS", data });
		} catch (error) {
			if (error?.code) return res.code(error.code).send({ error: error.message });
			return res.code(500).send({ error: error.message });
		}
	}

	GameSettings = async (req, res) => {
		try {
			const db = req.server.db;
			const userId = Number(req.user.userId);
			
			if (!Number.isInteger(userId)) {
				return res.code(400).send({ error: "Invalid user id" });
			}
			
			const settings = await this.getUserSettings(db, userId);
			return res.code(200).send({ message: "SUCCESS", settings });
		} catch (error) {
			if (error?.code) return res.code(error.code).send({ error: error.message });
			return res.code(500).send({ error: error.message });
		}
	}

	UpdateSettings = async (req, res) => {
		try {
			const userId = Number(req.user.userId);
			const db = req.server.db;

			const body = req.body ?? {};

			const { ball_speed, score_limit, paddle_size } = req.body ?? {};

			if (ball_speed !== undefined && !(ball_speed >= 1 && ball_speed <= 3))
				return res.code(400).send({ message: "Ball speed out of range" });

			if (score_limit !== undefined && !(score_limit >= 5 && score_limit <= 20))
				return res.code(400).send({ message: "Score limit out of range" });

			if (paddle_size !== undefined && !(paddle_size >= 1 && paddle_size <= 3))
				return res.code(400).send({ message: "Paddle size out of range" });

			const allowedKeys = new Set([
				"player_xp",
				"player_level",
				"game_mode",
				"ball_speed",
				"score_limit",
				"paddle_size",
			]);

			const payload = { userId };
			for (const [key, value] of Object.entries(body)) {
				if (allowedKeys.has(key)) payload[key] = value;
			}

			if (Object.keys(payload).length === 1) {
				return res.code(400).send({ message: "NO_FIELDS_TO_UPDATE" });
			}

			const result = await this.updateUserSettings(db, payload);

			return res.code(200).send(result);
		} catch (err) {
			const status = err?.code && Number.isInteger(err.code) ? err.code : 500;
			return res.code(status).send({message: err?.message || "INTERNAL_SERVER_ERROR",});
		}
	}

	protectRouter = async (req, res) =>{
		const roomId = req.params.roomId;
		const authUserId = Number(req.user?.userId);

		if(!roomId) return res.code(404).send({error: "INVALID_ROOM_ID"});
		if (!Number.isInteger(authUserId) || authUserId <= 0)
			return res.code(401).send({ error: "UNAUTHORIZED" });

		const game = activeGames.get(roomId);
		if(!game) return res.code(404).send({error: "GAME_NOT_FOUND"});

		const player1Id = Number(game?.player1?.id);
		const player2Id = Number(game?.player2?.id);
		if (authUserId !== player1Id && authUserId !== player2Id)
			return res.code(403).send({ error: "FORBIDDEN_ROOM_ACCESS" });

		return res.code(200).send({Game: game});
	}
	
}
export const MatchController = new matchController();
