import { MatchController } from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { activeGames } from "../store/memory.store.js";

export async function gameRoutes(fastify) {
	fastify.get("/history", { preHandler: authMiddleware }, MatchController.MatchHistory);
	fastify.get("/settings", { preHandler: authMiddleware }, MatchController.GameSettings);
	fastify.patch("/update-settings", { preHandler: authMiddleware }, MatchController.UpdateSettings);
	// fastify.patch("/rooms/:roomId/acction", { preHandler: authMiddleware }, async (req, res) =>{
	// 	const roomId = req.params.roomId;
	// 	// const db = req.server.db;
	// 	if(!roomId) return res.code(404).send({error: "INVALID_ROOM_ID"}) 

	// 	const game = activeGames.get(roomId);
	// 	if(!game) return res.code(404).send({error: "GAME_NOT_FOUND"})
	// });
}
