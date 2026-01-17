import jwt from "jsonwebtoken"
import { tokenModels } from "../models/token.model.js";

async function authMiddleware(request, reply)
{
    const db = request.server.db;
    const accessToken = request.cookies.accessToken;
    const refreshToken = request.cookies.refreshToken;
    try {
        if (!accessToken)
            throw new Error("UNAUTHORIZED_NO_ACCESS_TOKEN");
        if (refreshToken)
        {
            const blacklisted = tokenModels.isTokenRevoked(db, refreshToken);
            if (blacklisted)
                throw new Error("TOKEN_REVOKED");
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log(decoded);
        request.user = decoded;
    }
    catch (error) {
        if (error.name === "TokenExpiredError")
            return reply.code(401).send({error: "EXPIRED_TOKEN"});
        else if (error.name === "JsonWebTokenError")
            return reply.code(401).send({error: "INVALID_TOKEN"});
        else
            return reply.code(401).send({error: error.message});
    }

}

export { authMiddleware }