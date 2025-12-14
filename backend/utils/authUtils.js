import path from "path";
import jwt from "jsonwebtoken"

function generateFileNameByUser(username, filename)
{
    const extension = path.extname(filename).toLowerCase();
    const date = Date.now();
    const allowdExts = [".png", ".jpg", ".jpeg", ".webp"];
    if (!allowdExts.includes(extension))
        throw new Error("USUPPORTED_IMAGE_TYPE");
    const file = `${username}-${date}${extension}`
    return file;
}

function generateToken(userId, Username, secret, expiration, params, type)
{
    let payload;
    if (type === "access")
    {
        payload = {
            userId: userId,
            username: Username,
            isVerified: params.isVerified,
            hasAvatar: params.hasAvatar
        };
    }
    else
    {
        payload = {
            userId: userId,
            username: Username
        };
    }
    return jwt.sign(payload, secret, { expiresIn: expiration });
}

function updateTokenFlags(user, reply)
{
    const params = {
        isVerified: user.isverified,
        hasAvatar: !!user.avatar
    }
    const accessToken = generateToken(user.id, user.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
    reply.setCookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60 * 1000
    });
}

export { generateFileNameByUser, generateToken, updateTokenFlags }