import jwt from "jsonwebtoken"

async function authMiddleware(request, reply)
{
    reply.setCookie('refreshToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiY2NjY2NjY2MiLCJpYXQiOjE3NjM4Mzc4NDcsImV4cCI6MTc2MzgzODc0N30.rPWmvmSXOFHoasm-0bYlpC59-KeabIv_gbBWXfLSJy8", {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
    });
    const accessToken = request.cookies.accessToken;
    console.log(accessToken);
    if (accessToken == "null")
        reply.code(401).send({message: "UNAUTHORIZED_NO_ACCESS_TOKEN"});
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        request.user = decoded;
    }
    catch (error) {
        if (error.message.includes("TokenExpiredError"))
            return reply.code(401).send({error: "EXPIRED_TOKEN"});
        else if (error.message.includes("JsonWebTokenError"))
            return reply.code(401).send({error: "INVALID_TOKEN"});
        else
            return reply.code(401).send({error: error.message});
    }

}

export { authMiddleware }