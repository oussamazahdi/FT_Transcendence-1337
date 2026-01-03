import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';
import fastifyStatic from "@fastify/static";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from '@fastify/cors'
import googleOAuth2 from '@fastify/oauth2';
import rateLimit from '@fastify/rate-limit';
import twoFactor from "fastify-totp";

import { multipartConfig } from "../config/multipart.config.js";
import { corsConfig } from "../config/cors.config.js";
import { swaggerConfig, swaggerUiConfig } from '../config/swagger.config.js';
import { oauth2Config } from '../config/oauth.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerPlugins(fastify) {
		// CORS
		await fastify.register(cors, corsConfig);
		// Swagger
		await fastify.register(swagger, swaggerConfig);
		await fastify.register(swaggerUi, swaggerUiConfig);

		// await fastify.register(rateLimit, {
		//		 max: 1,
		//		 timeWindow: '1 minute'
		// });
		await fastify.register(twoFactor);

		//oauth2
		// await fastify.register(cookie,	{
		//		 secret: process.env.JWT_SECRET	// Use a consistent secret
		// });

		await fastify.register(googleOAuth2, oauth2Config);
		
		// Other plugins
		await fastify.register(multipart, multipartConfig);
		
		// Static files
		await fastify.register(fastifyStatic, {
				root: path.join(__dirname, '../uploads'),
				prefix: '/uploads/'
		});
}