import Fastify from "fastify";
import {PORT} from './config/env.js'
import cookiePlugin from '@fastify/cookie';
import corsPlugin from "./plugin/cors.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import databasePlugin from "./plugin/database.js"

const fastify = Fastify({ 
    logger:{
        transport:{
            target:"pino-pretty",
            option: {
                colorize:"true",
                translateTime: "yyyy-mm-dd HH:MM:ss",
                igonre: "pid, hostname",
            }
        }
    }
 });

fastify.register(cookiePlugin);
fastify.register(corsPlugin);
fastify.register(databasePlugin)
fastify.register(authRoutes);
fastify.register(userRoutes);

fastify.get('/', (request, reply) => {
    reply.send({hello:"world"});
})

fastify.listen({port:PORT},(err, address) => {
    console.log(`connection successfull on PORT:${PORT}`)
    if (err){
        fastify.log.error(err);
        process.exit(1);
    }
})