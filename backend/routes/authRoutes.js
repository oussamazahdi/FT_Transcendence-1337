import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

function authRoutes(fastify)
{
    fastify.post("/login", {
        schema: {
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
            }
        }
    }, authController.checkLogin);


    fastify.post("/register", {
        schema: {
            body: {
                type: 'object',
                required: ['firstname', 'lastname', 'username', 'email', 'password'],
                properties: {
                    firstname: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 15,
                    },
                    lastname: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 15,
                    },
                    username: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 15,
                    },
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                    },
                }
            }
        }
    }, authController.registerNewUser);

    fastify.post("/uploadImage", {preHandler: authMiddleware}, authController.uploadImage);
    fastify.get("/me", {preHandler: authMiddleware}, authController.getMe);
    fastify.post("/logout", {preHandler: authMiddleware}, authController.logout);
    fastify.post("/refresh", authController.generateNewToken);
    fastify.post("/resendCode", {preHandler: authMiddleware}, authController.resendCode);
    fastify.post("/emailVerification", {preHandler: authMiddleware}, authController.verifyEmail);
    // todo : 2FA, OAUTH
    // fastify.post("/enable2fa", {preHandler: authMiddleware}, authController.enable2fa);
}

export { authRoutes };