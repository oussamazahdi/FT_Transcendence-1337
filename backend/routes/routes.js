import { authRoutes } from "./auth.routes.js";
import { userRoutes } from "./user.routes.js";
// import { twoFactorRoutes } from "./twoFactor.routes.js"

function initializeRoutes(fastify)
{
    fastify.register(authRoutes, { prefix: '/api/auth' });
    fastify.register(userRoutes, { prefix: '/api/users' });
    // fastify.register(twoFactorRoutes, { prefix: '/api/2fa' });
}

export { initializeRoutes };
