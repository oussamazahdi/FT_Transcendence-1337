import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { errorResponse, emptySuccessResponse, objectSuccessResponse } from "../config/schemes.config.js";

function authRoutes(fastify)
{
    fastify.post("/login", {
        schema: {
            description: 'check if user exists in database & checks password validity then generate session tokens ',
            tags: ['Auth'],
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                    },
                }
            },
            response: {
                200: objectSuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, authController.checkLogin);


    fastify.post("/register", {
        schema: {
            description: 'Add new user, hashs the password, then generate session tokens',
            tags: ['Auth'],
            body: {
                type: 'object',
                required: ['firstname', 'lastname', 'username', 'email', 'password'],
                properties: {
                    firstname: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 15,
                        pattern: '^[a-zA-ZÀ-ÿ\\s\']+$'
                    },
                    lastname: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 15,
                        pattern: '^[a-zA-ZÀ-ÿ\\s\']+$'
                    },
                    username: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 15,
                        pattern: '^[a-zA-Z0-9_-]+$'
                    },
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    password: {
                        type: 'string',
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
    }, authController.registerNewUser);

    fastify.post("/uploadImage", {
        preHandler: authMiddleware,
        schema: {
            description: 'update user avatar, it takes a file or avatar name from our defaults, in case takes a file it being renamed with this form [$USERNAME-$EPOCH.png] and then update the avatar link',
            tags: ['Auth'],
            consumes: ['application/json', 'multipart/form-data'],
            response: {
                200: objectSuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }

        }

    }, authController.uploadImage);

    fastify.get("/me", {
        preHandler: authMiddleware,
        schema: {
            description: 'provides necessary data about the logged user',
            tags: ['Auth'],
            response: {
                200: objectSuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, authController.getMe);

    fastify.post("/logout", {
        preHandler: authMiddleware,
        schema: {
            description: 'verify validity of the refresh token then calculate the expiration date, revoke refresh token and remove it from db, then clear up both cookies',
            tags: ['Auth'],
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, authController.logout);

    fastify.post("/refresh", {
        schema: {
            description: 'generate new access token, based on validity of the refresh token',
            tags: ['Auth'],
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, authController.generateNewToken);

    fastify.post("/resendCode", {
        preHandler: authMiddleware,
        schema: {
            description: 'generate random six digits valid for 10min and save it in db, then send it to the user email',
            tags: ['Auth'],
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, authController.resendCode);

    fastify.post("/emailVerification", {
        preHandler: authMiddleware,
        schema: {
            description: 'checks if the given code matches the one stored in database and check if its expired',
            tags: ['Auth'],
            body: {
                type: 'object',
                required: ['code'],
                properties: {
                    code: {type: 'string', minLength: 6, maxLength: 6}
                }
            },
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, authController.verifyEmail);

}

export { authRoutes };