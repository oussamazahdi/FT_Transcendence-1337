import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

function generateSafeUSer(user){
    const {password, ...safeUser} = user;
    return safeUser;
}

export const signUp = async (request, reply) => {
    const {username, email, password, profileImage} = request.body;

    console.log(request.body);
    if(!username || !email || !password || !profileImage){
        reply.status(401).send({error: "missing field"});
        return;
    }

    const db = request.server.db;

    try{
        const userExists = db.prepare(
            'SELECT 1 FROM users WHERE username = ? OR email = ?'
        ).get(username, email);

        if (userExists){
            reply.status(402).send({ error: "User already exists"});
            return;
        }
    
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const insert = db.prepare(`
            INSERT INTO users (username, email, password, profileImage) VALUES (?, ?, ?, ?)`
        );

        const result = insert.run(username, email, hashedPassword, profileImage || null);

        const token = jwt.sign(
            {userId: result.lastInsertRowid},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        )
console.log('✅ Token generated:', token.slice(0, 20) + '...');  // ← Debug log
        reply.setCookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
console.log('✅ Cookie set successfully');
        reply.status(200).send({
            message: "success",
            userId: result.lastInsertRowid,
        });
        
    }catch(err){
        reply.status(500).send(err);
    }
}

export const signIn = async (request, reply) => {
    try{
        const {username, password} = request.body;
        console.log("from backend:", username, password);
        if(!username || !password){
            reply.status(400).send({error: "missing field"});
            return;
        }

        const db = request.server.db;

        const user = db.prepare(
            'SELECT id, username, email, password FROM users WHERE username = ?'
        ).get(username);

        if (!user){
            reply.status(400).send({ error: "User not exist"});
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid){
            reply.status(400).send({error: "Invalid password"});
            return ;
        }
        
        const token = jwt.sign(
            {userId:user.id},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        )
        
        reply.setCookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        const safeUser = generateSafeUSer(user);

        reply.status(200).send({
            success: true,
            message: "user signed in successfully",
            data:{
                safeUser,
            }
        })
    }catch(err){
        console.log(err);
        reply.status(500).send(err);
    }
};

export const signOut = async (request, reply) => {
    reply.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    
    reply.send({ message: "User signed out successfully" });
}