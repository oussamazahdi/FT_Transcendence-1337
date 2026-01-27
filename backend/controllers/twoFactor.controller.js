import { twoFactorModels } from "../models/twoFactor.model.js";
import { authModels } from "../models/auth.model.js";
import { generateToken, updateTokenFlags } from "../utils/authUtils.js";

export class TwoFactorController
{
    async  setup(request, reply)
    {
        const db = request.server.db;

        try {
            const secret = request.server.totp.generateSecret();

            const qrcode = await request.server.totp.generateQRCode({ 
                secret: secret.ascii,
                issuer: 'ft_transcendence',
                label: request.user.username
            });
            twoFactorModels.setUser2FASecret(db, secret.ascii, request.user.userId);
            return reply.code(201).send({message: "QR_CREATED_SUCCESSFULLY", qr: qrcode});

        }
        catch (error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            return reply.code(500).send({error: error.message});
        }
    }

    enable(request, reply)
    {
        const db = request.server.db;

        try {
            const token = request.body.token;
            const secret = twoFactorModels.getUser2FASecret(db, request.user.userId);
            const result = request.server.totp.verify({ secret: secret, token: token });
            
            if (!result)
                return reply.code(400).send({error: "INVALID_2FA_TOKEN"});

            twoFactorModels.update2FAStatus(db, 1, request.user.userId);
            const user = authModels.findUserById(db, request.user.userId);
            updateTokenFlags(user, reply);
            return reply.code(200).send({message: "2FA_ENABLED_SUCCESSFULLY"});
        }
        catch (error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            return reply.code(500).send(error.message);
        }
    }

    verify(request, reply)
    {
        const db = request.server.db;

        try {
            const token = request.body.token;
            const secret = twoFactorModels.getUser2FASecret(db, request.user.userId);
            const result = request.server.totp.verify({ secret: secret, token: token, window: 0 });

            if (!result)
                return reply.code(400).send({error: "INVALID_2FA_TOKEN"});
            const user = authModels.findUserById(db, request.user.userId);
            const params = {
                isVerified: !!user.isverified,
                hasAvatar: !!user.avatar,
                status2fa: !!user.status2fa,
                session2FA: 0
            }
            const accessToken = generateToken(user.id, user.username, process.env.JWT_SECRET, process.env.JWT_EXPIRATION, params, "access");
            reply.setCookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            twoFactorModels.update2FASessionStatus(db, 0, request.user.userId);
            return reply.code(200).send({message: "2FA_VERIFIED_SUCCESSFULLY"});
        }
        catch (error)
        {
            console.log(error);
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            return reply.code(500).send(error.message);
        }
    }

    disable(request, reply)
    {
        const db = request.server.db;

        try {
            twoFactorModels.update2FAStatus(db, 0, request.user.userId);
            const user = authModels.findUserById(db, request.user.userId);
            updateTokenFlags(user, reply);
            return reply.code(200).send({message: "2FA_DISABLED_SUCCESSFULLY"});
        }
        catch (error)
        {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            return reply.code(500).send({error: error.message});
        }
    }
}

export const twoFactorController = new TwoFactorController();