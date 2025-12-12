import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

function generateToken(userId, Username, secret, expiration, params, type)
{
    let payload;
    if (type === "access")
    {
        payload = {
            userId: userId,
            username: Username,
            isUserVerified: params.isUserVerified,
            hasAvatar: params.hasAvatar
        };
        
    }
    else
    {
        payload = {
            userId: userId,
            username: Username,
        };

    }
    console.log(payload);
    return jwt.sign(payload, secret, { expiresIn: expiration });
}

async function loginUser(db, email, password)
{
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
    if (!user)
        return ({message: "USER_NOT_FOUND"});
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return ({message: "INVALID_PASSWORD"});
    const params = {
        isUserVerified: !!user.isuserverified,
        hasAvatar: !!user.avatar
    }
    const accessToken = generateToken(user.id, user.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
    const refreshToken = generateToken(user.id, user.username, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION, params, "refresh");
    db.prepare(`INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)`).run(user.id, refreshToken);
    return ({accessToken: accessToken, refreshToken: refreshToken});
}

async function addNewUser(db, firstname, lastname, username, email, password)
{
    let cryptedPass = await bcrypt.hash(password, 12);
    db.prepare(`INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`).run(firstname, lastname, username, email, cryptedPass);
    const user = db.prepare(`SELECT id, firstname, lastname, username, email, avatar, isuserverified FROM users WHERE email = ?`).get(email);
    const params = {
        isUserVerified: !!user.isuserverified,
        hasAvatar: !!user.avatar
    }
    const accessToken = generateToken(user.id, user.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
    const refreshToken = generateToken(user.id, user.username, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION, params, "refresh");
    db.prepare(`INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)`).run(user.id, refreshToken);
    return ({accessToken: accessToken, refreshToken: refreshToken});
}

export { loginUser, addNewUser, generateToken };