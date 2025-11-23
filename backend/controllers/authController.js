import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";
import { pipeline } from 'stream/promises';
import { loginUser, addNewUser, generateToken } from "../models/authModel.js";
import { generateFileNameByUser } from "../utils/authUtils.js";
import { verify } from "crypto";
import { error } from "console";


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

async function checkLogin(request, reply)
{
    const { email, password } = request.body;
    const db = request.server.db;
    try {
        const tokens = await loginUser(db, email, password);
        if (tokens.message && tokens.message.includes("USER_NOT_FOUND"))
            return reply.code(404).send({error: "USER_NOT_FOUND"});
        if (tokens.message && tokens.message.includes("INVALID_PASSWORD"))
            return reply.code(403).send({error: "INVALID_PASSWORD"});
        reply.setCookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        reply.setCookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000
        });
        return reply.code(200).send({message: "AUTHORIZED"});
    }
    catch (error) {
            return reply.code(500).send({error: error.message});
    }
}


async function registerNewUser(request, reply)
{
    const { firstname, lastname, username, email, password } = request.body;
    const db = request.server.db;
    try {
        const tokens = await addNewUser(db, firstname, lastname, username, email, password);
        reply.setCookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        reply.setCookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000
        });
        return reply.code(201).send({message: "USER_CREATED_SUCCESSFULLY"});
    }
    catch (error)
    {
        if (error.message.includes('UNIQUE constraint failed'))
            return reply.code(409).send({error: "USER_IS_ALREADY_EXIST"});
        else if (error.message.includes('NOT NULL constraint failed'))
            return reply.code(400).send({error: "MISSING_FIELD"});
        else
            return reply.code(500).send({error: error.message});
    }
}

async function processImage(request, reply)
{
    /**
     * needs protection and separation model from the controller
     */
    const db = request.server.db;
    const uploadDir = path.join(process.cwd(), 'uploads');
    const image = await request.file();
    const filename = generateFileNameByUser(request.user.username, image.filename);
    const filePath = path.join(uploadDir, filename);
    await pipeline(image.file, fs.createWriteStream(filePath));
    let result = db.prepare('UPDATE users SET profilepicture = ? WHERE id = ?').run(filePath, request.user.userId);
    reply.code(200).send({message: "SUCCESS", data: {path: filePath}});
}

function generateNewToken(request, reply)
{
    const db = request.server.db;
    const refreshToken = request.cookies.refreshToken;
    const accessToken = request.cookies.accessToken;

    try {
        if (!refreshToken || !accessToken)
            throw new Error("UNAUTHORIZED_NO_TOKEN");
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const tokenDbResults = db.prepare('SELECT refresh_token FROM tokens WHERE refresh_token = ?').get(refreshToken); // check if token exists
        if (!tokenDbResults)
            throw new Error("INVALID_TOKEN")
        const newAccessToken = generateToken(decoded.userId, decoded.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION);
        reply.setCookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000
        });
        return reply.code(201).send({message: "TOKEN_REFRESHED_SUCCESSFULLY"});
    }
    catch (error) {
        return reply.code(401).send({error: error.message});
    }
}

export { checkLogin, registerNewUser, processImage, generateNewToken };