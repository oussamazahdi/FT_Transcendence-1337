import { notificationsSuccessResponse, errorResponse } from "../config/schemes.config.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { NotifController } from "../controllers/notif.controller.js";

export async function notifRoutes(fastify, opts) {

  fastify.get("/", { preHandler: authMiddleware,
      schema: {
        response: {
          200: notificationsSuccessResponse,
          401: errorResponse,
          500: errorResponse,
        },
      },
    }, NotifController.getForUser);

  fastify.post("/:id/action", { preHandler: authMiddleware,
    schema:{
      body: {
        type: "object",
        required: ["action"],
        properties: { action: { type: "string", enum: ["accept", "reject"] } }
      }
    }
  },NotifController.notificationAction);
  
	fastify.get("/:id", { preHandler: authMiddleware }, NotifController.getNotifById);
	fastify.get("/unread-count", { preHandler: authMiddleware }, NotifController.unreadCounter);
  fastify.patch("/:id/read",{ preHandler: authMiddleware }, NotifController.markAsReadById);
}
