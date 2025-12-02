import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";
import { pipeline } from 'stream/promises';
import { loginUser, addNewUser, generateToken } from "../models/authModel.js";
import { generateFileNameByUser } from "../utils/authUtils.js";

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
        const user = db.prepare('SELECT firstname, lastname, username, email, avatar FROM users WHERE email = ?').get(email);
        return reply.code(200).send({message: "AUTHORIZED", userData: user});
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
    /*
     * needs protection and separation model from the controller
     */
    try {
        const db = request.server.db;
        const isMultipart = request.headers['content-type']?.startsWith('multipart/form-data');
        let fileLink = null;
        if (isMultipart)
        {
            const uploadDir = path.join(process.cwd(), 'uploads');
                const image = await request.file();
                const filename = generateFileNameByUser(request.user.username, image.filename);
                const filePath = path.join(uploadDir, filename);
                await pipeline(image.file, fs.createWriteStream(filePath));
                fileLink = `${request.host}/uploads/${filename}`;
        }
        else 
        {
            const { avatar } = JSON.parse(request.body);
            console.log(avatar);
            const availableAvatars = ["profile1", "profile2", "profile3", "profile4", "profile5", "profile6"];
            if (!availableAvatars.includes(avatar))
                return reply.code(400).send("INVALID_AVATAR");
            fileLink = `${request.host}/uploads/default/${avatar}.jpeg`;
        }
        db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(fileLink, request.user.userId);
        const user = db.prepare('SELECT firstname, lastname, username, email, avatar FROM users WHERE id = ?').get(request.user.userId);
        reply.code(200).send({message: "SUCCESS", userData: user});
    }
    catch (error)
    {
        return reply.code(400).send({error: error.message});
    }
}

function generateNewToken(request, reply)
{
    const db = request.server.db;
    const refreshToken = request.cookies.refreshToken;
    const accessToken = request.cookies.accessToken;

    try {
        if (!refreshToken || !accessToken)
            throw new Error("UNAUTHORIZED_NO_TOKEN");
        const blacklisted = db.prepare('SELECT * FROM revoked_tokens WHERE refresh_token = ?').get(refreshToken);
        if (blacklisted)
            throw new Error("TOKEN_REVOKED");
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

async function getUserData(request, reply) 
{
    const db = request.server.db;
	try {
        const user = db.prepare('SELECT firstname, lastname, username, email, avatar FROM users WHERE id = ?').get(request.user.userId);
        return reply.code(200).send({message: "SUCCESS", userData: user});
    }
    catch (error) {
        return reply.code(401).send({error: error.message});
    }
}

async function logoutUser(request, reply)
{
    const db = request.server.db
    try {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken)
            return reply.code(401).send("NO_TOKEN_PROVIDED");
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const expiration = new Date(decoded.exp * 1000).toISOString();
        db.prepare('DELETE FROM tokens WHERE refresh_token = ?').run(refreshToken);
        db.prepare('INSERT INTO revoked_tokens (refresh_token, expirationdate) VALUES (?, ?)').run(refreshToken, expiration);
        reply.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
        reply.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
        return reply.code(200).send({message: "LOGGED_OUT"});

    }
    catch (error) {
        return reply.code(400).send({error: error.message});
    }
}

export { checkLogin, registerNewUser, processImage, generateNewToken, getUserData, logoutUser };