
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { errorResponse, emptySuccessResponse, objectSuccessResponse, nestedObjectSuccessResponse } from "../config/schemes.config.js";

function userRoutes(fastify)
{
    fastify.get("/", {
        preHandler: authMiddleware,
        schema: {
            description: 'provides every user in the database',
            tags: ['Users'],
            response: {
                200: nestedObjectSuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, userController.getAllUsers);

    fastify.get("/:id", {
        preHandler: authMiddleware,
        schema: {
            description: 'get specific user from database by id',
            tags: ['Users'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer' }
                },
                required: ['id']
            },
            response: {
                200: objectSuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, userController.getOneUser);

    fastify.put("/:id", {
        preHandler: authMiddleware,
        schema: {
            description: 'update user data ',
            tags: ['Users'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer' }
                },
                required: ['id']
            },
            // body: {
            //     type: 'object',
            //     properties: {
            //             firstname: {
            //                 type: 'string',
            //                 minLength: 3,
            //                 maxLength: 15,
            //             },
            //             lastname: {
            //                 type: 'string',
            //                 minLength: 3,
            //                 maxLength: 15,
            //             },
            //             username: {
            //                 type: 'string',
            //                 minLength: 3,
            //                 maxLength: 15,
            //             },
            //             email: {
            //                 type: 'string',
            //                 format: 'email'
            //             },
            //             password: {
            //                 type: 'string',
            //                 minLength: 8,
            //             },
            //     },

            // },
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, userController.updateUser);

    fastify.delete("/:id", {
        preHandler: authMiddleware,
        schema: {
            description: 'delete specific user from database',
            tags: ['Users'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer' }
                },
                required: ['id']
            },
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, userController.deleteUser);

    fastify.post("/change-password", {
        preHandler: authMiddleware,
        schema: {
            description: 'change current password, after checking the validity of the new password and the old one',
            tags: ['Users'],
            body: {
                type: 'object',
                properties: {
                    oldPassword: {
                        minLength: 8,
                        maxLength: 64,
                    },
                    newPassword: {
                        minLength: 8,
                        maxLength: 64,
                    },
                    repeatNewPassword: {
                        minLength: 8,
                        maxLength: 64,
                    },
                }
            },
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, userController.changePassword);
    // TODO: Refactor search later - needs querystring
    fastify.get("/search", {
        preHandler: authMiddleware,
        schema: {
            description: 'search route is under construction',
            tags: ['Users'],
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, userController.searchUsers);
}

export { userRoutes };