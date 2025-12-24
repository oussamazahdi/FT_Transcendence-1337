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
            const users = db.prepare('SELECT id, firstname, lastname, username, email, avatar From users WHERE id = ?').get(userId);
            return (users)
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getAllUsers');
            throw dbError;
        }

    }
    
    updateUserById(db, userId, userData)
    {
        try {
            const result = db.prepare('UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, avatar = ? WHERE id = ?')
			.run(userData.firstname, userData.lastname, userData.username, userData.email, userData.avatar, userId);
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getAllUsers');
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

}

export const userModels = new UserModels();