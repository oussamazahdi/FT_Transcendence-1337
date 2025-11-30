import jwt from "jsonwebtoken"

async function authMiddleware(request, reply)
{
    const accessToken = request.cookies.accessToken;
    if (!accessToken)
        return reply.code(401).send({message: "UNAUTHORIZED_NO_ACCESS_TOKEN"});
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        request.user = decoded;
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        // console.log("decoded =>>> ", decoded);
        // console.log("request =>>> ", request.user);
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