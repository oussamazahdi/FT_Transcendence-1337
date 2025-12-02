import { checkLogin, registerNewUser, processImage, generateNewToken, getUserData, logoutUser } from "../controllers/authController.js";
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
    }, checkLogin);


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
    }, registerNewUser);

    fastify.post("/uploadImage", {preHandler: authMiddleware}, processImage);
    fastify.get("/me", {preHandler: authMiddleware} ,getUserData);
    fastify.post("/logout", {preHandler: authMiddleware}, logoutUser);
    fastify.get("/refresh", generateNewToken);
    // todo : 2FA, OAUTH
}

export { authRoutes };