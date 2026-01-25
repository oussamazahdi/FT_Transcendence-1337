import { chatController } from "../controllers/chat.controller.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

function chatRoutes(fastify)
{
    fastify.get("/conversations/all", {preHandler: authMiddleware}, chatController.getAllConversations);
    fastify.get("/conversations", {preHandler: authMiddleware}, chatController.searchConversations);
    fastify.get("/messages", {preHandler: authMiddleware}, chatController.getAllMessages);
}