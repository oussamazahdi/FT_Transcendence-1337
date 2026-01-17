import path from "path";
import jwt from "jsonwebtoken"

function randomPasswordGenerator(length)
{
    var result           = '';
    var characters       = '!@#$%^&*()_+{}<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateFileNameByUser(username, filename, mimetype)
{
    const extension = path.extname(filename).toLowerCase();
    const date = Date.now();
    const allowdExts = [".png", ".jpg", ".jpeg", ".webp"];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(mimetype))
        throw new Error("USUPPORTED_IMAGE_TYPE");
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
            hasAvatar: params.hasAvatar,
            status2fa: params.status2fa
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
        isVerified: !!user.isverified,
        hasAvatar: !!user.avatar,
        status2fa: !!user.status2fa
    }
    const accessToken = generateToken(user.id, user.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
    reply.setCookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60 * 1000
    });
}

export { generateFileNameByUser, generateToken, updateTokenFlags, randomPasswordGenerator }