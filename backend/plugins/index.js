import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';
import fastifyStatic from "@fastify/static";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from '@fastify/cors'

import { corsConfig } from "../config/cors.config.js";
import { swaggerConfig, swaggerUiConfig } from '../config/swagger.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerPlugins(fastify) {
    // CORS
    await fastify.register(cors, corsConfig);
    // Swagger
    await fastify.register(swagger, swaggerConfig);
    await fastify.register(swaggerUi, swaggerUiConfig);
    
    // Other plugins
    await fastify.register(multipart);
    await fastify.register(cookie);
    
    // Static files
    await fastify.register(fastifyStatic, {
        root: path.join(__dirname, '../uploads'),
        prefix: '/uploads/'
    });
}