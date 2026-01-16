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

			const page = Number(req.query.page ?? 1);
			const pageSize = Number(req.query.pageSize ?? 10);

			const data = await match.getMatchHistoryByUserId(db, userId, { page, pageSize });

			return res.code(200).send({ message: "SUCCESS", data });
		} catch (error) {
			if (error?.code) return res.code(error.code).send({ error: error.message });
			return res.code(500).send({ error: error.message });
		}
	});
}
