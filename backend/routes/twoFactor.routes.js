import { authMiddleware } from "../middlewares/authMiddleware.js";
import { twoFactorController } from "../controllers/twoFactor.controller.js"
import fastify from "fastify";
import { errorResponse, emptySuccessResponse, twoFaSetupResponse, twoFaTokenBody } from "../config/schemes.config.js";


function twoFactorAuthRoutes(fastify)
{
    fastify.post("/setup", {
        preHandler: authMiddleware,
        schema: {
            description: "Generate QR code for 2FA setup",
            tags: ['Auth'],
            response: {
                201: twoFaSetupResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, twoFactorController.setup);
    
    fastify.post("/enable", {
        preHandler: authMiddleware,
        schema: {
            description: "Enable 2FA using TOTP token",
            tags: ['Auth'],
            body: twoFaTokenBody,
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, twoFactorController.enable);
    
    fastify.post("/verify", {
        preHandler: authMiddleware,
        schema: {
            description: "Verify 2FA token",
            tags: ['Auth'],
            body: twoFaTokenBody,
            response: {
                200: emptySuccessResponse,
                400: errorResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, twoFactorController.verify);
    
    fastify.post("/disable", {
        preHandler: authMiddleware,
        schema: {
            description: "Disable 2FA",
            tags: ['Auth'],
            response: {
                200: emptySuccessResponse,
                401: errorResponse,
                500: errorResponse
            }
        }
    }, twoFactorController.disable);

}

export { twoFactorAuthRoutes };
