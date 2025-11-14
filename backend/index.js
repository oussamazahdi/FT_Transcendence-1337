import Fastify from "fastify"
import Sqlite3 from "sqlite3"
import { initRoutes } from "./routes/routes.js";
import { initDatabase } from "./database/databaseUtils.js";
import corsPlugin from "./plugins/cors.js";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });


const db = new Sqlite3.Database("./database/transcendence.db", Sqlite3.OPEN_READWRITE, (error) => {
    if (error)
        console.log(error?.message);
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