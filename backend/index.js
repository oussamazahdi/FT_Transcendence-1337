import Fastify from "fastify";
import Sqlite3 from "better-sqlite3";
import { initRoutes } from "./routes/routes.js";
import { initDatabase } from "./database/databaseUtils.js";
import corsPlugin from "./plugins/cors.js";
import dotenv from "dotenv";
import multipart from "@fastify/multipart";
import { Server } from "socket.io";
import { initSocketManager } from "./RemoteGame/socketManager.js"; // ✅ IMPORT FIX

dotenv.config({ path: "../.env" });

/* ---------------- FASTIFY SETUP ---------------- */

const db = new Sqlite3("./database/transcendence.db");
const fastify = Fastify({ logger: false });

fastify.register(multipart);
fastify.register(corsPlugin);
fastify.decorate("db", db);
initDatabase(fastify.db);
initRoutes(fastify);

fastify.setNotFoundHandler((request, reply) => {
	reply.code(404).send({ msg: "Waloooo nech a 3chiri makayn walo gha gheyrha" });
});

/* ---------------- SOCKET.IO ---------------- */
let io;

fastify.ready((err) => {
	if (err) throw err;

	io = new Server(fastify.server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"]
		},
		transports: ["websocket", "polling"]
	});
	initSocketManager(io);
});

/* ---------------- server start ---------------- */
await fastify.listen({ port: 3001, host: '0.0.0.0' }, (error) => {
	if (error) {
		console.error(error.message);
		process.exit(1);
	}
});
