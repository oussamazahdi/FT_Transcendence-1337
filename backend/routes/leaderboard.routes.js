import { authMiddleware } from "../middlewares/authMiddleware.js";
import { leaderboardController } from "../controllers/leaderboard.controller.js"
import { 
    errorResponse,
    usersRanking,
    paginationQuerySchema
} from "../config/schemes.config.js"

function leaderboardRoutes(fastify)
{
    fastify.get('/', {
        preHandler: authMiddleware,
        schema: {
            description: "Get ranking of the users by xp",
            tags: ['Leaderboard'],
            querystring: paginationQuerySchema,
            response: {
                200: usersRanking,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, leaderboardController.getRankingByXp);
}

export { leaderboardRoutes };