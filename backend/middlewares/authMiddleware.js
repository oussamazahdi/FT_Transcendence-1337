import jwt from "jsonwebtoken"

async function authMiddleware(request, reply)
{
    const db = request.server.db;
    const accessToken = request.cookies.accessToken;
    const refreshToken = request.cookies.refreshToken;
    try {
        if (!accessToken)
            throw new Error("UNAUTHORIZED_NO_ACCESS_TOKEN");
        const blacklisted = db.prepare('SELECT * FROM revoked_tokens WHERE refresh_token = ?').get(refreshToken);
        if (blacklisted)
            throw new Error("TOKEN_REVOKED");
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
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