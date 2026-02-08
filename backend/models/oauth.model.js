import { handleDatabaseError } from '../utils/dbErrorHandler.js';
import bcrypt from "bcrypt"

export class OAuthModels
{
    getUserByGoogleId(db, googleId)
    {
        try {
            return  db.prepare(`SELECT id, firstname, lastname, username, email, avatar FROM users WHERE google_id = ?`).get(googleId);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getUserByGoogleId');
            throw dbError;
        }
    }

    async addNewUser(db, googleId, firstname, lastname, username, email, avatar, password)
    {
        try {
            let cryptedPass = await bcrypt.hash(password, 12);
            db.prepare(`INSERT INTO users (google_id, firstname, lastname, username, email, avatar, password, isverified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(googleId, firstname, lastname, username, email, avatar, cryptedPass, 1);
            const user = db.prepare(`SELECT id, firstname, lastname, username, email, avatar FROM users WHERE email = ?`).get(email);
            return (user);
        } 
        catch (error) {
                const dbError = handleDatabaseError(error, 'addNewUser');
                throw dbError;
        }
    }
}


export const oauthModels = new OAuthModels();