import { MatchController } from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { activeGames } from "../store/memory.store.js";

export async function gameRoutes(fastify) {
	fastify.get("/history", { preHandler: authMiddleware }, MatchController.MatchHistory);
	fastify.get("/settings", { preHandler: authMiddleware }, MatchController.GameSettings);
	fastify.patch("/update-settings", { preHandler: authMiddleware }, MatchController.UpdateSettings);
	fastify.get("/rooms/:roomId/action", { preHandler: authMiddleware }, MatchController.protectRouter);
}
