import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";
import { pipeline } from 'stream/promises';


/*
    request object :
        request.body → POST/PUT data
        request.params → URL parameters (/user/:id)
        request.query → Query strings (?name=kamal)
        request.headers → HTTP headers
        request.method → GET, POST, etc.
        request.url → l'URL path
    Reply object :
        reply.send(data) → bach t-sender response
        reply.code(200) → bach t-setter status code
        reply.header('key', 'value') → bach tzid headers
        reply.status(404).send() → alternative syntax
        reply.type('application/json') → content-type
*/

function generateToken(userId, Username)
{
    const payload = {
        userId: userId,
        username: Username
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function checkLogin(request, reply)
{
    const { email, password } = request.body;
    const db = request.server.db;
    try {
        const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
        if (!user)
            return reply.code(404).send({error: "USER_NOT_FOUND"});
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return reply.code(403).send({error: "INVALID_PASSWORD"});
        const accessToken = generateToken(user.id, user.username);
        return reply.code(200).send({message: "AUTHORIZED", token: accessToken}); // update later enhance later and create refresh and access token
    }
    catch (error) {
            console.log(error.message);
            return reply.code(500).send({error: "INTERNAL_SERVER_ERROR"});
    }
}


async function registerNewUser(request, reply)
{
    const { firstname, lastname, username, email, password } = request.body;
    const db = request.server.db;
    let cryptedPass = await bcrypt.hash(password, 12);
    try {
        db.prepare(`INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`).run(firstname, lastname, username, email, cryptedPass);
        return reply.code(201).send({message: "USER_CREATED_SUCCESSFULLY"});
    }
    catch (error)
    {
        if (error.message.includes('UNIQUE constraint failed'))
            return reply.code(409).send({error: "USER_IS_ALREADY_EXIST"});
        else if (error.message.includes('NOT NULL constraint failed'))
            return reply.code(400).send({error: "MISSING_FIELD"});
        else
        {
            console.log(error.message);
            return reply.code(500).send({error: "INTERNAL_SERVER_ERROR"});
        }
    }
}

async function processImage(request, reply)
{
    const uploadDir = process.cwd() + '/uploads/';
    const image = await request.file();
    const filePath = uploadDir + image.filename;
    console.log(filePath);
    await pipeline(image.file, fs.createWriteStream(filePath));

    reply.code(200).send({message: "SUCCESS", data: {path: filePath}});
}

export { checkLogin, registerNewUser, processImage };