import Fastify from "fastify";
import dotenv from 'dotenv';

import { serverConfig } from "./config/server.config.js";
import { registerPlugins } from "./plugins/index.js";
import { registerDecorators } from "./utils/decorators.js";
import { initAllTables } from "./database/tables/initDatabase.js";
import { initializeRoutes } from "./routes/routes.js";
import { setupTokenCleanup } from './jobs/revokedTokensCleanup.js';

dotenv.config({ path: '../.env' });

const app = Fastify(serverConfig);

// Setup decorators (db, nodemailer)
registerDecorators(app);

// Initialize database
initAllTables(app.db);

// Setup cron jobs
setupTokenCleanup(app.db);

// Register plugins
await registerPlugins(app);

// Register routes
initializeRoutes(app);

export default app;