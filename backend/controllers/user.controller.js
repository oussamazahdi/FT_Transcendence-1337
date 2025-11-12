import fastify from "fastify";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";


export const getUsers = async () => {
    const db = fastify.db;
    const row = db.prepare(`SELECT id, username, email, created_at FROM users`).all();
    return row;
}

export const getUser = async (request, reply) => {
    try {
        console.log('\n=== PROFILE REQUEST ===');
        console.log('📍 Cookies received:', request.cookies);  // ← Debug log
        const token = request.cookies.authToken;
        
        console.log('🔑 Token from cookie:', token ? 'Present' : 'MISSING');  // ← Debug log
        if (!token) {
        console.log('❌ No token found in cookies');
          return reply.status(405).send({ error: 'Not authenticated' });
        }

        let decoded;
        try {
          decoded = jwt.verify(token, JWT_SECRET);
            console.log('✅ Token verified, userId:', decoded.userId);  // ← Debug log
        } catch (err) {
                      console.log('❌ Token verification failed:', err.message);  // ← Debug log
          return reply.status(406).send({ error: 'Invalid or expired token' });
        }

        const db = request.server.db;

        const user = db.prepare(
          'SELECT id, firstname, lastname, username, email, avatar FROM users WHERE id = ?'
        ).get(decoded.userId);

        if (!user) {
                    console.log('❌ User not found in database');
          return reply.status(407).send({ error: 'User not found' });
        }



        console.log('✅ User profile retrieved:', user.username);

        reply.send({
          success: true,
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            avatar: user.avatar
          }});

      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        reply.status(500).send({ error: error.message });
      }
};