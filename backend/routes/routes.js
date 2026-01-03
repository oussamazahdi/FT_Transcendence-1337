import { authRoutes } from "./auth.routes.js";
import { userRoutes } from "./user.routes.js";
import { oauthRoutes } from "./oauth.routes.js";
import { twoFactorAuthRoutes } from "./twoFactor.routes.js"

function initializeRoutes(fastify)
{
		fastify.register(authRoutes, { prefix: '/api/auth' });
		fastify.register(userRoutes, { prefix: '/api/users' });
		fastify.register(oauthRoutes, { prefix: '/api/oauth' });
		fastify.register(twoFactorAuthRoutes, {prefix: '/api/2fa/'});

}

export { initializeRoutes };
