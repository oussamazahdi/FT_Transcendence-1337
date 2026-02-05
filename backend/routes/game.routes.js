import { MatchController } from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function gameRoutes(fastify) {
	fastify.get("/history", { preHandler: authMiddleware }, MatchController.MatchHistory);
	fastify.get("/settings", { preHandler: authMiddleware }, MatchController.GameSettings);
	fastify.patch("/update-settings", { preHandler: authMiddleware }, MatchController.UpdateSettings);
}
