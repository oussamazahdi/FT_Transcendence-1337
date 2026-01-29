import { chatController } from "../controllers/chat.controller.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { 
    errorResponse,
    allConversationsResponse,
    searchConversationsResponse,
    allMessagesResponse,
    searchQuerySchema,
    messagesQuerySchema
} from "../config/schemes.config.js"

function chatRoutes(fastify)
{
    fastify.get("/conversations/all", {
        preHandler: authMiddleware,
        schema: {
            description: "Get all conversations for logged user",
            tags: ['Chat'],
            response: {
                200: allConversationsResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, chatController.getAllConversations);

    fastify.get("/conversations", {
        preHandler: authMiddleware,
        schema: {
            description: "Search conversations by friend name/username",
            tags: ['Chat'],
            querystring: searchQuerySchema,
            response: {
                200: searchConversationsResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, chatController.searchConversations);

    fastify.get("/messages", {
        preHandler: authMiddleware,
        schema: {
            description: "Get all messages from a conversation with pagination",
            tags: ['Chat'],
            querystring: messagesQuerySchema,
            response: {
                200: allMessagesResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, chatController.getAllMessages);
}

export { chatRoutes }