import fp from 'fastify-plugin'
import db from "../database/SQLite.js";

async function databasePlugin(fastify) {
  // Make db available to all routes via fastify.db
  console.log('✅ Database plugin initializing...');
  
  fastify.decorate('db', db);

console.log('✅ Database decorated on fastify');

  // Optional: Add graceful shutdown
  fastify.addHook('onClose', (instance, done) => {
    db.close();
    done();
  });
}

export default fp(databasePlugin);