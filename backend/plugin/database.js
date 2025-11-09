import fp from 'fastify-plugin'
import db from "../database/SQLite.js";

async function databasePlugin(fastify) {
  fastify.decorate('db', db);
}

export default fp(databasePlugin);