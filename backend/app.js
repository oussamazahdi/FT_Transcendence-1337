import './env.js'; // Load environment variables FIRST

import Fastify from "fastify";
import { serverConfig } from "./config/server.config.js";
import { registerPlugins } from "./plugins/index.js";
import { registerDecorators } from "./utils/decorators.js";
import { initAllTables } from "./database/tables/initDatabase.js";
import { initializeRoutes } from "./routes/routes.js";
import { setupTokenCleanup } from './jobs/revokedTokensCleanup.js';

const app = Fastify(serverConfig);

registerDecorators(app);

initAllTables(app.db);

setupTokenCleanup(app.db);

await registerPlugins(app);

initializeRoutes(app);

export default app;