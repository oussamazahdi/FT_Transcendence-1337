import { checkLogin, registerNewUser } from "../controllers/authController.js";

function authRoutes(fastify)
{
    fastify.post("/login", checkLogin);

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
}

export { authRoutes };