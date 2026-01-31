import { oauthModels } from "../models/oauth.model.js";
import { authModels } from "../models/auth.model.js";
import { randomPasswordGenerator, generateToken } from "../utils/authUtils.js";

export class OAuthController
{
    async googleOAuth(request, reply)
    {
        const db =  request.server.db;
        const params = {
            isVerified: true,
            hasAvatar: true
        }
        const goTo = `${process.env.FRONTEND_URL}/dashboard`;
        console.log(goTo);
        try {
            const { token } = await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            
            const response = await fetch(process.env.GOOGLE_OAUTH_USERINFO_URL, {
            headers: { Authorization: `Bearer ${token.access_token}` }
            })
            const googleUser = await response.json();
            let result = oauthModels.getUserByGoogleId(db, googleUser.id);
            if (!result)
            {
                const username = `${googleUser.given_name}-${googleUser.id}`;
                const password = randomPasswordGenerator(20);
                result = await oauthModels.addNewUser(db, googleUser.id, googleUser.given_name, googleUser.family_name, username, googleUser.email, googleUser.picture, password);
            }
            const accessToken = generateToken(result.id, result.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
            const refreshToken = generateToken(result.id, result.username, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION, null, "refresh");
            authModels.addNewToken(db, result.id, refreshToken);
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            reply.setCookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000
            });
            return reply.redirect(goTo);

        }
        catch (error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
}

export const oauthController = new OAuthController();