import { handleDatabaseError } from '../utils/dbErrorHandler.js';

export class TokenModels {
    
    isTokenRevoked(db, refreshToken) {
        try {
            const result = db.prepare('SELECT * FROM revoked_tokens WHERE refresh_token = ?').get(refreshToken);
            return !!result;
        } catch (error) {
            const dbError = handleDatabaseError(error, 'isTokenRevoked');
            throw dbError;
        }
    }
    
    tokenExists(db, refreshToken) {
        try {
            const result = db.prepare('SELECT refresh_token FROM tokens WHERE refresh_token = ?').get(refreshToken);
            return !!result;
        } catch (error) {
            const dbError = handleDatabaseError(error, 'tokenExists');
            throw dbError;
        }
    }
    
    deleteToken(db, refreshToken) {
        try {
            const result = db.prepare('DELETE FROM tokens WHERE refresh_token = ?').run(refreshToken);
            return result;
        } catch (error) {
            const dbError = handleDatabaseError(error, 'deleteToken');
            throw dbError;
        }
    }
    
    revokeToken(db, refreshToken, expirationDate) {
        try {
            const result = db.prepare('INSERT INTO revoked_tokens (refresh_token, expirationdate) VALUES (?, ?)')
                .run(refreshToken, expirationDate);
            return result;
        } catch (error) {
            const dbError = handleDatabaseError(error, 'revokeToken');
            throw dbError;
        }
    }
    
}

export const tokenModels = new TokenModels();