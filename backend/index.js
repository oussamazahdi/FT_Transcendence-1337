import Fastify from "fastify"
import Sqlite3 from "better-sqlite3"
import dotenv from 'dotenv';
import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from "@fastify/static";
import { initAllTables } from "./database/tables/initDatabase.js";
import { initRoutes } from "./routes/routes.js";
import corsPlugin from "./plugins/cors.js";

dotenv.config({ path: '../.env' });
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new Sqlite3('./database/transcendence.db', { 
    verbose: console.log  // Optional: log queries
});

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
            }
        }
    }
});

fastify.register(multipart);
fastify.register(corsPlugin);
fastify.register(cookie);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/'
});
fastify.decorate('db', db);
initAllTables(fastify.db);
initRoutes(fastify);

fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({msg : "Waloooo nech a 3chiri makayn walo gha gheyrha"});
});

await fastify.listen({port: 3001}, (error) => {
    if (error)
    {
        console.error(error.message);
        process.exit(1);
    }
});