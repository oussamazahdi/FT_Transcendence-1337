import Fastify from "fastify"
import Sqlite3 from "better-sqlite3"
import { initRoutes } from "./routes/routes.js";
import { initDatabase } from "./database/databaseUtils.js";
import corsPlugin from "./plugins/cors.js";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import multipart from '@fastify/multipart';


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
fastify.decorate('db', db);
initDatabase(fastify.db);
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