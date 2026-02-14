import bcrypt from "bcrypt"
import { handleDatabaseError } from '../utils/dbErrorHandler.js';


export class UserModels
{
    getAllUsers(db)
    {
        try {
            const users = db.prepare('SELECT id, firstname, lastname, username, email, avatar FROM users').all();
            return (users)
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getAllUsers');
            throw dbError;
        }
    }
    
    getUserById(db, userId)
    {
        try {
            const users = db.prepare(`
                SELECT  u.id AS id,
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
            return (users)
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getUserById');
            throw dbError;
        }

    }
    
    updateUserById(db, userId, userData)
    {
        try {
            const mEmail = userData.email.toLowerCase();
            const mUsername = userData.username.toLowerCase();
            const result = db.prepare('UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, avatar = ? WHERE id = ?')
			.run(userData.firstname, userData.lastname, mUsername, mEmail, userData.avatar, userId);
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'updateUserById');
            throw dbError;
        }

    }

    getPassword(db, userId)
    {
        try
        {
            const result = db.prepare('SELECT password FROm users WHERE id = ?').get(userId);
            return (result.password);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getPassword');
            throw dbError;
        }
    }

    async setNewPassword(db, userId, newPassword)
    {
        try
        {
            let cryptedPass = await bcrypt.hash(newPassword, 12);
            const resut = db.prepare("UPDATE users SET password = ? WHERE id = ?").run(cryptedPass, userId);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'setNewPassword');
            throw dbError;
        }
    }

    searchUsers(db, query, limit, offset)
    {
        try {
            const result = db.prepare(`
                SELECT id, firstname, lastname, username, avatar
                FROM users
                WHERE firstname LIKE '%' || :query || '%'
                    OR lastname LIKE '%' || :query || '%'
                    OR username LIKE '%' || :query || '%'
                ORDER BY
                    CASE
                        WHEN username  LIKE :query || '%' THEN 1
                        WHEN firstname LIKE :query || '%' THEN 2
                        WHEN lastname  LIKE :query || '%' THEN 3
                        WHEN username  LIKE '%' || :query || '%' THEN 4
                        WHEN firstname LIKE '%' || :query || '%' THEN 5
                        WHEN lastname  LIKE '%' || :query || '%' THEN 6
                        ELSE 7
                    END,
                    username ASC
                LIMIT :limit
                OFFSET :offset;
                `).all({query: query, limit: limit, offset: offset});
            return (result);
        }
        catch (error)
        {
            const dbError = handleDatabaseError(error, 'searchUsers');
            throw dbError;
        }
    }

}

export const userModels = new UserModels();