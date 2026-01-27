import { authMiddleware } from "../middlewares/authMiddleware.js";
import { FriendsController, friendsController } from "../controllers/friends.controller.js"
import fastify from "fastify";
import { errorResponse,
    emptySuccessResponse,
    friendsListResponse,
    friendRequestsResponse,
    sentFriendRequestsResponse,
    blockedUsersResponse,
    idParamSchema
} from "../config/schemes.config.js";
import { FriendsModels } from "../models/friends.model.js";

function friendsRoutes(fastify)
{
    fastify.get("/", {
        preHandler: authMiddleware,
        schema: {
            description: "Get friends list",
            tags: ['Friends'],
            response: {
                200: friendsListResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.getAllFriends);

    fastify.post("/search", {preHandler: authMiddleware}, friendsController.searchFriends)
    
    fastify.get("/requests", {
        preHandler: authMiddleware,
        schema: {
            description: "Get incoming friend requests",
            tags: ['Friends'],
            response: {
                200: friendRequestsResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.getAllFriendRequests);
    
    fastify.get("/requests/sent", {
        preHandler: authMiddleware,
        // schema: {
        //     description: "Get outgoing friend requests",
        //     tags: ['Friends'],
        //     response: {
        //         200: sentFriendRequestsResponse,
        //         401: errorResponse,
        //         500: errorResponse
        //     }
        // }
    }, friendsController.getSentRequests);

    fastify.post("/requests/:id", {
        preHandler: authMiddleware,
        schema: {
            description: "Send friend request",
            tags: ['Friends'],
            params: idParamSchema,
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                409: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.sendFriendRequest);
    
    fastify.post("/requests/:id/accept", {
        preHandler: authMiddleware,
        schema: {
            description: "Accept friend request",
            tags: ['Friends'],
            params: idParamSchema,
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                409: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.acceptFriendRequest);
    
    fastify.get("/blocks", {
        preHandler: authMiddleware,
        schema: {
            description: "Get blocked users",
            tags: ['Friends'],
            response: {
                200: blockedUsersResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.getAllBlocked);
    
    fastify.post("/blocks/:id", {
        preHandler: authMiddleware,
        schema: {
            description: "Block user",
            tags: ['Friends'],
            params: idParamSchema,
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                409: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.block);
    
    fastify.delete("/blocks/:id", {
        preHandler: authMiddleware,
        schema: {
            description: "Unblock user",
            tags: ['Friends'],
            params: idParamSchema,
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                409: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.unblock);
    
    fastify.delete("/:id", {
        preHandler: authMiddleware,
        schema: {
            description: "Remove friend",
            tags: ['Friends'],
            params: idParamSchema,
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                409: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.unfriend);
    
    fastify.delete("/requests/:id", {
        preHandler: authMiddleware,
        schema: {
            description: "Cancel friend request",
            tags: ['Friends'],
            params: idParamSchema,
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                409: errorResponse,
                500: errorResponse
            }
        }
    }, friendsController.cancelFriendRequest);
}

export { friendsRoutes };