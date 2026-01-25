import { handleDatabaseError } from '../utils/dbErrorHandler.js';


export class TwoFactorModels
{

    setUser2FASecret(db, secret, userId)
    {
        try{
            db.prepare(`UPDATE users SET secret2fa = ? WHERE id = ?`).run(secret, userId);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'setUser2FASecret');
            throw dbError;
        }
    }


    update2FAStatus(db, status, userId)
    {
        try{
            db.prepare(`UPDATE users SET status2fa = ? WHERE id = ?`).run(status, userId);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'update2FAStatus');
            throw dbError;
        }
    }

    getUser2FASecret(db, userId)
    {
        try {
            const result = db.prepare('SELECT secret2fa FROM users WHERE id = ?').get(userId);
            return (result.secret2fa);
        }
        catch (error)
        {
            const dbError = handleDatabaseError(error, 'getUser2FASecret');
            throw dbError;
        }
    }

}


export const twoFactorModels = new TwoFactorModels();