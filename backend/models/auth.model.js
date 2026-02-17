import bcrypt from "bcrypt"
import { handleDatabaseError } from '../utils/dbErrorHandler.js';

export class AuthModels 
{
    addNewToken(db, userId, token)
    {
        try {
            db.prepare(`INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)`).run(userId, token);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'addNewToken');
            throw dbError;
        }
    }
    async loginUser(db, email, password)
    {
        try {
            const mEmail = email.toLowerCase();
            const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(mEmail);
            if (!user)
                return ({message: "USER_NOT_FOUND"});
            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return ({message: "INVALID_PASSWORD"});
            return (user);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'addNewUser');
            throw dbError;
        }
    }
    async addNewUser(db, firstname, lastname, username, email, password)
    {
        try {
            const mUsername = username.toLowerCase();
            const mEmail = email.toLowerCase();
            let cryptedPass = await bcrypt.hash(password, 12);
            db.prepare(`INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`).run(firstname, lastname, mUsername, mEmail, cryptedPass);
            const user = db.prepare(`SELECT id, firstname, lastname, username, email, avatar, isverified, status2fa FROM users WHERE email = ?`).get(mEmail);
            return (user);
        } 
        catch (error) {
                const dbError = handleDatabaseError(error, 'addNewUser');
                throw dbError;
        }
    }
    findUserById(db, userId)
    {
        try {
            const result = db.prepare(`
                SELECT  u.id,
                        u.username,
                        u.firstname,
                        u.lastname,
                        u.email,
                        u.avatar,
                        u.isverified,
                        u.status2fa,
                        u.session2fa,
                        gs.player_level,
                        gs.player_xp
                FROM users u
                JOIN game_settings gs ON gs.player_id = u.id
                WHERE u.id = ?`).get(userId);
                return (result);
        } 
        catch (error) {
            const dbError = handleDatabaseError(error, 'findUserById');
            throw dbError;
        }
    }

    findUserByEmail(db, email, fields = ['firstname', 'lastname', 'username', 'email', 'avatar', 'isverified'])
    {
        try {
            const mEmail = email.toLowerCase();
            const fieldList = fields.join(', ');
            return db.prepare(`SELECT ${fieldList} FROM users WHERE email = ?`).get(mEmailmail);
        } 
        catch (error) {
            const dbError = handleDatabaseError(error, 'findUserByEmail');
            throw dbError;
        }
    }

    updateUserAvatar(db, userId, avatarUrl)
    {
        try 
        {
            const result = db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatarUrl, userId);
            return result;
        } 
        catch (error) 
        {
            if (error.code === 404) throw error;
            const dbError = handleDatabaseError(error, 'updateUserAvatar');
            throw dbError;
        }
    }

    getUserEmail(db, userId)
    {
        try {
            const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
            if (!user) {
                throw { code: 404, message: 'USER_NOT_FOUND' };
            }
            return user.email;
        } 
        catch (error) 
        {
            if (error.code === 404) throw error;
            const dbError = handleDatabaseError(error, 'getUserEmail');
            throw dbError;
        }
    }

    updateUserOTP(db, userId, otp, expiration)
    {
        try 
        {
            const result = db.prepare('UPDATE users SET otp = ?, otpexpiration = ? WHERE id = ?')
                .run(otp, expiration, userId);
            
            if (result.changes === 0) 
                throw { code: 404, message: 'USER_NOT_FOUND' };
            
            return result;
        } 
        catch (error) 
        {
            if (error.code === 404) throw error;
            const dbError = handleDatabaseError(error, 'updateUserOTP');
            throw dbError;
        }
    }

    getUserVerificationData(db, userId)
    {
        try {
            const user = db.prepare('SELECT isverified, otp, otpexpiration FROM users WHERE id = ?').get(userId);
            if (!user) {
                throw { code: 404, message: 'USER_NOT_FOUND' };
            }
            return user;
        } 
        catch (error) {
            if (error.code === 404) throw error;
            const dbError = handleDatabaseError(error, 'getUserVerificationData');
            throw dbError;
        }
    }

    markEmailVerified(db, userId)
    {
        try {
            const result = db.prepare('UPDATE users SET isverified = ? WHERE id = ?').run(1, userId);
            
            if (result.changes === 0) {
                throw { code: 404, message: 'USER_NOT_FOUND' };
            }
            
            return result;
        } 
        catch (error) {
            if (error.code === 404) throw error;
            const dbError = handleDatabaseError(error, 'markEmailVerified');
            throw dbError;
        }
    }
}

export const authModels = new AuthModels();