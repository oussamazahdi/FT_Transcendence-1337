import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import db from '../database/SQLite.js';

export const authorization = async (request, reply) => {
    try{
        let token; 

        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
            token = request.headers.authorization.split(' ')[1];
        }

        if (!token){
            reply.status(410).send({message: "Unauthorized: Missing or invalid token"});
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        console.log(decoded);

        const user = db.prepare(`
            SELECT id FROM users WHERE id = ?`
        ).get(decoded.userId);

        console.log(user);

        if(!user){
            reply.status(411).send({message: "Unauthorized: Token verification failed"});
            return;
        }
        request.user = user;

    }catch(err){
        reply.status(412).send(err);
    }
};