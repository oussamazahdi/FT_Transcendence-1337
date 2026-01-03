import { authMiddleware } from "../middlewares/authMiddleware.js";
import { twoFactorController } from "../controllers/twoFactor.controller.js"
import fastify from "fastify";

function twoFactorAuthRoutes(fastify)
{
		fastify.post("/setup", {preHandler: authMiddleware}, twoFactorController.setup);
		fastify.post("/enable", {preHandler: authMiddleware}, twoFactorController.enable);
		fastify.post("/verify", {preHandler: authMiddleware}, twoFactorController.verify);
		fastify.post("/disable", {preHandler: authMiddleware}, twoFactorController.disable);

}

export { twoFactorAuthRoutes };