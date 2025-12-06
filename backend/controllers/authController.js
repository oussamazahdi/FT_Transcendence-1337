import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";
import { pipeline } from 'stream/promises';
import { loginUser, addNewUser, generateToken } from "../models/authModel.js";
import { generateFileNameByUser } from "../utils/authUtils.js";


export class AuthController {

    async   checkLogin(request, reply)
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
    
    
    async   registerNewUser(request, reply)
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
    
    async   uploadImage(request, reply)
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
    
    async   generateNewToken(request, reply)
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
    
    async   getMe(request, reply) 
    {
        const db = request.server.db;
        try {
            const user = db.prepare('SELECT firstname, lastname, username, email, avatar, isverified FROM users WHERE id = ?').get(request.user.userId);
            return reply.code(200).send({message: "SUCCESS", userData: user});
        }
        catch (error) {
            return reply.code(401).send({error: error.message});
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
    
    async   resendCode(request, reply)
    {
        try {
    
            const db = request.server.db;
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiration = new Date(Date.now() + 10 * 60 * 1000).toISOString();
            const letter = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email Verification</title>
                    </head>
                    <body>
                        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #2a2a3e; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                                        <tr>
                                            <td style="padding: 50px 40px;">
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center" style="padding-bottom: 40px;">
                                                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                                                <span style="font-size: 40px;">🏓</span>
                                                            </div>
                                                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ft_transcendence</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Verify Your Email</h2>
                                                <p style="color: #a0a0b0; font-size: 15px; line-height: 1.6; margin: 0 0 40px 0; text-align: center;">
                                                    Enter your verification code
                                                </p>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center">
                                                            <div style="background-color: #1a1a2e; border: 2px solid #667eea; border-radius: 12px; padding: 25px 40px;">
                                                                <span style="font-size: 48px; font-weight: bold; letter-spacing: 15px; color: #667eea;">{{OTP_CODE}}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                <p style="color: #a0a0b0; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
                                                    Expires in <span style="color: #667eea;">10 minutes</span>
                                                </p>
                                                
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background-color: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 16px 16px;">
                                                <p style="color: #707080; font-size: 12px; margin: 0;">
                                                    © 2025 ft_transcendence
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>`.replace("{{OTP_CODE}}", code);
            const user = db.prepare('SELECT email FROM users WHERE id = ?').get(request.user.userId);
            db.prepare('UPDATE users SET otp = ?, otpexpiration = ? WHERE id = ?').run(code, expiration, request.user.userId);
            // console.log(email.email);
            await request.server.nodemailer.sendMail({
                from: "ft_transcendence <badj5510@gmail.com>",
                to: user.email,
                subject: '🏓 Verification Code - ft_transcendence',
                html: letter
            })
            return reply.code(200).send({message: "VERIFICATION_CODE_SENT_SUCCESSFULY"});
        }
        catch (error)
        {
            return reply.code(400).send({error: error.message});
        }
    }
    
    async   verifyEmail(request, reply)
    {
        try{
            const today = new Date(Date.now()).toISOString();
            const db = request.server.db;
            const { code } = request.body;
            
            const user = db.prepare('SELECT isverified, otp, otpexpiration FROM users WHERE id = ?').get(request.user.userId);
            if (user.isverified)
                throw new Error("EMAIL_IS_ALREADY_VERIFIED");
            if (today > user.otpexpiration)
                throw new Error("EXPIRED_OTP");
            if (code !== user.otp)
                throw new Error("INCORRECT ");
            db.prepare('UPDATE users SET isverified = ? WHERE id = ?').run(1, request.user.userId);
            return reply.code(200).send({message: "EMAIL_CONFIREMED_SUCCESSFULLY"});
        }
        catch(error)
        {
            return reply.code(400).send({error: error.message});
        }
    }

    // async   enable2fa(request, reply)
    // {
    //     const db = request.server.db;

    //     try {
    //         const secret = fastify.totp.generateSecret()
    
    //         const qrcode = await fastify.totp.generateQRCode({ 
    //             secret: secret.ascii,
    //             issuer: 'ft_transcendence', // ✅ Your app name
    //         })

    //     }
    // }
}


export const authController = new AuthController();