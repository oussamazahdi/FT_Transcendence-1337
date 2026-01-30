import { NotifServices } from "../services/Notification.service.js";
import { notificationsSuccessResponse, errorResponse } from "../config/schemes.config.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function notifRoutes(fastify, opts) {
  const service = new NotifServices();

  fastify.get("/", {
      preHandler: authMiddleware,
      schema: {
        response: {
          200: notificationsSuccessResponse,
          401: errorResponse,
          500: errorResponse,
        },
      },
    },
    async (req, res) => {
      try {
        const db = req.server.db;
        const userId = req.user.userId;

        const notifications = await service.getForUser(db, userId);
				console.log("all data", notifications)
        return res.code(200).send({ ok:true, message: "SUCCESS", userData: notifications });
      
      } catch (error) {
        if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
        return res.code(500).send({ok:false, error: error.message});
      }
    }
  );

  fastify.post("/:id/action", {
    preHandler: authMiddleware,
    schema:{
      body: {
        type: "object",
        required: ["action"],
        properties: { action: { type: "string", enum: ["accept", "reject"] } }
      }
    }
  },async (req, res)=> {
    try {
      const db = req.server.db;
      const userId = req.user.userId;
      const id = Number(req.params.id);
      const { action } = req.body;
      
      if(!Number.isInteger(id)) return res.code(400).send({ok:false, error:"Invalid notification id"});
      const update = await service.act(db, {id, userId, action})
      return res.code(200).send({ok:true, message:"SUCCESS", userData: update});
    
    } catch(error) {
      if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
      return res.code(500).send({ok:false, error: error.message});
      
    }
  })
  
  fastify.patch("/:id/read",{ preHandler: authMiddleware }, async (req, res)=>{
    try {
      const db = req.server.db;
      const userId = req.user.userId;
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.code(400).send({ok:false,  error: "Invalid notification id" });
      
      const read = await service.markAsRead(db, {id, userId});
      return res.code(200).send({ok:true, message:"SUCCESS", userData: read});
    
    } catch(error) {
      if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
      return res.code(500).send({ok:false, error: error.message});
    }
  })


  fastify.get("/unread-count",{ preHandler: authMiddleware }, async (req, res)=>{
    try {
      const db = req.server.db;
      const userId = req.user.userId;
      const id = Number(userId);
      if (!Number.isInteger(id)) return res.code(400).send({ok:false,  error: "Invalid notification id" });
      
      const notifications = await service.getForUser(db, userId);
      const unreadCount = notifications.reduce((acc, notif) => acc + (notif.is_read ? 0 : 1), 0);
      return res.code(200).send({ok:true, message:"SUCCESS", unreadCount});
    
    } catch(error) {
      if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
      return res.code(500).send({ok:false, error: error.message});
    }
  })


	fastify.get("/:id", { preHandler: authMiddleware }, async (req, res) => {
		try {
			const db = req.server.db;
			const id = Number(req.params.id);
	
			if (!Number.isInteger(id) || id <= 0) return res.code(400).send({ok: false, error: "Invalid notification id",});

			const notification = await service.getById(db, id);

			if (!notification) return res.code(404).send({ok: false, error: "Notification not found",});

			return res.code(200).send({ok: true, message: "SUCCESS", notif: notification,});

		} catch (error) {
			if (error?.code) {
				return res.code(error.code).send({ ok: false, error: error.message });
			}
			return res.code(500).send({ ok: false, error: "Internal server error" });
		}
	});


	

}
