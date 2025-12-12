import { handleDatabaseError } from "../utils/dbErrorHandler";


export class TokenModels 
{
    isTokenRevoked(db, refreshToken)
    {
        try 
        {
            const result = db.prepare("SELECT * FROM revoked_tokens WHERE refresh_token = ?")
            .get(refreshToken);
            return (!!result);
        }
        catch (error)
        {
            const dbError = handleDatabaseError(error, "isTokenRevoked");
            throw dbError;
        }
    }
}