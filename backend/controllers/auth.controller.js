import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";
import { pipeline } from 'stream/promises';
import { authModels } from "../models/auth.model.js";
import { generateFileNameByUser, generateToken, updateTokenFlags } from "../utils/authUtils.js";
import { tokenModels } from "../models/token.model.js";
import { getEmailLetter } from "../templates/emailLetter.js";


export class AuthController {

    async   checkLogin(request, reply)
    {
        const { email, password } = request.body;
        const db = request.server.db;
        try {
            const result = await authModels.loginUser(db, email, password);
            const params = {
                isVerified: !!result.isverified,
                status2fa: !!result.status2fa
            }
            if (result.message && result.message.includes("USER_NOT_FOUND"))
                return reply.code(404).send({error: "USER_NOT_FOUND"});
            if (result.message && result.message.includes("INVALID_PASSWORD"))
                return reply.code(403).send({error: "INVALID_PASSWORD"});
            const accessToken = generateToken(result.id, result.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
            const refreshToken = generateToken(result.id, result.username, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION, null, "refresh");
            authModels.addNewToken(db, result.id, refreshToken);
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            reply.setCookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return reply.code(200).send({message: "AUTHORIZED", userData: result});
        }
        catch (error) {
            // console.log(error);
                if (error.code)
                    return reply.code(error.code).send({error: error.message});
                else
                    return reply.code(500).send({error: error.message});
        }
    }
    
    
    async   registerNewUser(request, reply)
    {
        const { firstname, lastname, username, email, password } = request.body;
        const db = request.server.db;
        try {
            const user = await authModels.addNewUser(db, firstname, lastname, username, email, password);
            const params = {
                isVerified: !!user.isverified,
                hasAvatar: !!user.avatar,
                status2fa: !!user.status2fa
            }
            const accessToken = generateToken(user.id, user.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
            const refreshToken = generateToken(user.id, user.username, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION, null, "refresh");
            authModels.addNewToken(db, user.id, refreshToken);
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            reply.setCookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return reply.code(201).send({message: "USER_CREATED_SUCCESSFULLY"});
        }
        catch (error)
        {
            // console.log(error);
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async   uploadImage(request, reply)
    {
        try {
            const db = request.server.db;
            const isMultipart = request.headers['content-type']?.startsWith('multipart/form-data');
            let fileLink = null;
            if (isMultipart)
            {
                const uploadDir = path.join(process.cwd(), 'uploads');
                const image = await request.file();
                const filename = generateFileNameByUser(request.user.username, image.filename, image.mimetype);
                const filePath = path.join(uploadDir, filename);
                await pipeline(image.file, fs.createWriteStream(filePath));
                fileLink = `${process.env.API_URL}/uploads/${filename}`;
            }
            else 
            {
                const { avatar } = request.body;
                const availableAvatars = ["profile1", "profile2", "profile3", "profile4", "profile5", "profile6"];
                if (!availableAvatars.includes(avatar))
                    return reply.code(400).send("INVALID_AVATAR");
                fileLink = `${process.env.API_URL}/uploads/default/${avatar}.jpeg`;
            }
            authModels.updateUserAvatar(db, request.user.userId, fileLink);
            const user = authModels.findUserById(db, request.user.userId);
            updateTokenFlags(user, reply);
            reply.code(200).send({message: "SUCCESS", userData: user});
        }
        catch (error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async   generateNewToken(request, reply)
    {
        const db = request.server.db;
        const refreshToken = request.cookies.refreshToken;
        const accessToken = request.cookies.accessToken;
    
        try {
            if (!refreshToken || !accessToken)
                throw new Error("UNAUTHORIZED_NO_TOKEN");
            const blacklisted = tokenModels.isTokenRevoked(db, refreshToken);
            if (blacklisted)
                throw new Error("TOKEN_REVOKED");
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            //query the status of isVerfied from the database to get fresh data in case refeesh token have old data
            const tokenDbResults = tokenModels.tokenExists(db, refreshToken); // check if token exists
            if (!tokenDbResults)
                throw new Error("INVALID_TOKEN");
            const user = authModels.findUserById(db, decoded.userId);
            updateTokenFlags(user, reply);
            return reply.code(201).send({message: "TOKEN_REFRESHED_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async   getMe(request, reply) 
    {
        const db = request.server.db;
        try {
            const user = authModels.findUserById(db, request.user.userId);
            // console.log(user)
            return reply.code(200).send({message: "SUCCESS", userData: user});
        }
        catch (error) {
            // console.log(error);
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async   logout(request, reply)
    {
        const db = request.server.db
        try {
            const refreshToken = request.cookies.refreshToken;
            if (!refreshToken)
                return reply.code(401).send("NO_TOKEN_PROVIDED");
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const expiration = new Date(decoded.exp * 1000).toISOString();
            tokenModels.deleteToken(db, refreshToken);
            tokenModels.revokeToken(db, refreshToken, expiration);
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
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async   resendCode(request, reply)
    {
        try {
    
            const db = request.server.db;
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiration = new Date(Date.now() + 10 * 60 * 1000).toISOString();
            const letter = getEmailLetter(code);
            const email = authModels.getUserEmail(db, request.user.userId);
            authModels.updateUserOTP(db, request.user.userId, code, expiration);
            await request.server.nodemailer.sendMail({
                from: "ft_transcendence <badj5510@gmail.com>",
                to: email,
                subject: '🏓 Verification Code - ft_transcendence',
                html: letter
            })
            return reply.code(200).send({message: "CODE_SENT_SUCCESSFULLY"})
        }
        catch (error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async   verifyEmail(request, reply)
    {
        try{
            const today = new Date(Date.now()).toISOString();
            const db = request.server.db;
            const { code } = request.body;
            
            const user = authModels.getUserVerificationData(db, request.user.userId);
            if (user.isverified)
                throw new Error("EMAIL_IS_ALREADY_VERIFIED");
            if (today > user.otpexpiration)
                throw new Error("EXPIRED_OTP");
            if (code !== user.otp)
                throw new Error("INCORRECT");
            authModels.markEmailVerified(db, request.user.userId);
            const userflags = authModels.findUserById(db, request.user.userId);
            updateTokenFlags(userflags, reply);
            return reply.code(200).send({message: "EMAIL_CONFIREMED_SUCCESSFULLY"});
        }
        catch(error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
}


export const authController = new AuthController();