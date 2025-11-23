import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";

function initRoutes(fastify)
{
    fastify.register(authRoutes, { prefix: '/api/auth' });
    fastify.register(userRoutes, { prefix: '/api/users' });
}

export { initRoutes };
