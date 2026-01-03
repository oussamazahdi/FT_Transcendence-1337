import { oauthController } from "../controllers/oauth.controller.js";
import { errorResponse, emptySuccessResponse, objectSuccessResponse } from "../config/schemes.config.js";



function oauthRoutes(fastify)
{
		fastify.get("/google/callback", {
						schema: {
								description: "register or login users using google OAuth",
								tags: ['Auth'],
								response: {
										200: emptySuccessResponse,
										400: errorResponse,
										401: errorResponse,
										500: errorResponse
								}
						}
				}, oauthController.googleOAuth);
}

export { oauthRoutes }