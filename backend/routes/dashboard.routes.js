import { authMiddleware } from "../middlewares/authMiddleware.js";
import { dashboardController } from "../controllers/dashboard.controller.js"


function dashboardRoutes(fastify)
{
    fastify.get("/", {preHandler: authMiddleware}, dashboardController.allTimeStatistics);
    fastify.get("/weekly", {preHandler: authMiddleware}, dashboardController.weeklyStatistics);
}

export { dashboardRoutes };