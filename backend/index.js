import Fastify from "fastify"
import Sqlite3 from "better-sqlite3"
import dotenv from 'dotenv';
import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from "@fastify/static";
import nodemailer from 'nodemailer'
// import fastifyTotp from 'fastify-totp'

// locals
import { initAllTables } from "./database/tables/initDatabase.js";
import { initializeRoutes } from "./routes/routes.js";
import corsPlugin from "./plugins/cors.js";
import { setupTokenCleanup } from './jobs/revokedTokensCleanup.js';

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

const transporter = nodemailer.createTransport( {
    host: process.env.SMTP_SERVER,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASSWORD
    }
});

fastify.decorate('nodemailer', transporter);
// await fastify.register(fastifyTotp);
fastify.register(multipart);
fastify.register(corsPlugin);
fastify.register(cookie);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/'
});
fastify.decorate('db', db);

setupTokenCleanup(fastify.db);
initAllTables(fastify.db);
initializeRoutes(fastify);

await fastify.listen({port: 3001}, (error) => {
    if (error)
    {
        console.error(error.message);
        process.exit(1);
    }
});