import { MatchController } from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const match = new MatchController();

export async function gameRoutes(fastify) {
	fastify.get("/history", { preHandler: authMiddleware }, async (req, res) => {
		try {
			const db = req.server.db;
			const userId = Number(req.user.userId);

			if (!Number.isInteger(userId)) {
				return res.code(400).send({ error: "Invalid user id" });
			}
			
			const data = await match.getMatchHistoryByUserId(db, userId);
			
			console.log("***********************************> we are in fastify.get history");
			return res.code(200).send({ message: "SUCCESS", data });
		} catch (error) {
			if (error?.code) return res.code(error.code).send({ error: error.message });
			return res.code(500).send({ error: error.message });
		}
	});
	
	fastify.get("/settings", { preHandler: authMiddleware }, async (req, res)=>{
		try {
			const db = req.server.db;
			const userId = Number(req.user.userId);
	
			if (!Number.isInteger(userId)) {
				return res.code(400).send({ error: "Invalid user id" });
			}

			const settings = await match.getUserSettings(db, userId);
	
			return res.code(200).send({ message: "SUCCESS", settings });
		} catch (error) {
			if (error?.code) return res.code(error.code).send({ error: error.message });
			return res.code(500).send({ error: error.message });
		}
	})


fastify.patch("/update-settings", { preHandler: authMiddleware }, async (req, reply) => {
  try {
    const userId = Number(req.user.userId);
		const db = req.server.db;

    const body = req.body ?? {};

		const { ball_speed, score_limit, paddle_size } = req.body ?? {};

  	if (ball_speed !== undefined && !(ball_speed >= 1 && ball_speed <= 3))
    	return reply.code(400).send({ message: "Ball speed out of range" });

	  if (score_limit !== undefined && !(score_limit >= 5 && score_limit <= 20))
  	  return reply.code(400).send({ message: "Score limit out of range" });

  	if (paddle_size !== undefined && !(paddle_size >= 1 && paddle_size <= 3))
    	return reply.code(400).send({ message: "Paddle size out of range" });

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
      return reply.code(400).send({ message: "NO_FIELDS_TO_UPDATE" });
    }

    const result = await match.updateUserSettings(db, payload);

    return reply.code(200).send(result);
  } catch (err) {
    const status = err?.code && Number.isInteger(err.code) ? err.code : 500;
    return reply.code(status).send({message: err?.message || "INTERNAL_SERVER_ERROR",});
  }
});

}
