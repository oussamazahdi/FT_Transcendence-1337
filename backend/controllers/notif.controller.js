import { NotifServices } from "../services/Notification.service.js";

class notifController {
	async getForUser(req, res) {
		try {
			const db = req.server.db;
			const userId = req.user.userId;

			const notifications = await NotifServices.getForUser(db, userId);
			return res.code(200).send({ ok:true, message: "SUCCESS", notifications: notifications });
		
		} catch (error) {
			if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
			return res.code(500).send({ok:false, error: error.message});
		}
	}

	async notificationAction (req, res){
		try {
			const db = req.server.db;
			const userId = req.user.userId;
			const id = Number(req.params.id);
			const { action } = req.body;
			
			if(!Number.isInteger(id)) return res.code(400).send({ok:false, error:"Invalid notification id"});
			const update = await NotifServices.act(db, {id, userId, action})
			return res.code(200).send({ok:true, message:"SUCCESS", userData: update});
		
		} catch(error) {
			if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
			return res.code(500).send({ok:false, error: error.message});
			
		}
	}

	async markAsReadById (req, res) {
		try {
      const db = req.server.db;
      const userId = req.user.userId;
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.code(400).send({ok:false,  error: "Invalid notification id" });
      
      const read = await NotifServices.markAsRead(db, {id, userId});
      return res.code(200).send({ok:true, message:"SUCCESS", userData: read});
    
    } catch(error) {
      if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
      return res.code(500).send({ok:false, error: error.message});
    }
	}

	async unreadCounter (req, res) {
		try {
			const db = req.server.db;
			const userId = req.user.userId;
			const id = Number(userId);
			if (!Number.isInteger(id)) return res.code(400).send({ok:false,  error: "Invalid notification id" });
			
			const notifications = await NotifServices.getForUser(db, userId);
			const unreadCount = notifications.reduce((acc, notif) => acc + (notif.is_read ? 0 : 1), 0);
			return res.code(200).send({ok:true, message:"SUCCESS", unreadCount});
		
		} catch(error) {
			if (error?.code) return res.code(error.code).send({ok:false, error: error.message});
			return res.code(500).send({ok:false, error: error.message});
		}
	}
	
	// async unreadCounter (req, res) {
	// 	try {
	// 		const db = req.server.db;
	// 		const userId = Number(req.user?.userId);
			
	// 		if (!Number.isInteger(userId) || userId <= 0) return res.code(400).send({ ok: false, error: "Invalid userId" });

	// 		// check notif models we have one
	// 		const row = db.prepare(`SELECT COUNT(*) AS unreadCount FROM notifications
	// 			WHERE receiver_id = ? AND is_read = 0 AND (is_expired = 0 OR is_expired IS NULL)`).get(userId);

	// 		const unreadCount = Number(row?.unreadCount ?? 0);

	// 		return res.code(200).send({ ok: true, message: "SUCCESS", unreadCount });
		
	// 	} catch (err) {
	// 		const status = Number(err?.code);
	// 		if (Number.isInteger(status) && status >= 400 && status <= 599) {
	// 			return res.code(status).send({ ok: false, error: err.message });
	// 		}
	// 		return res.code(500).send({ ok: false, error: err?.message || "Internal Server Error" });
	// 	}
	// }

	async getNotifById (req, res) {
		try {
			const db = req.server.db;
			const id = Number(req.params.id);
	
			if (!Number.isInteger(id) || id <= 0) return res.code(400).send({ok: false, error: "Invalid notification id",});

			const notification = await NotifServices.getById(db, id);

			if (!notification) return res.code(404).send({ok: false, error: "Notification not found",});

			return res.code(200).send({ok: true, message: "SUCCESS", notif: notification,});

		} catch (error) {
			if (error?.code) {
				return res.code(error.code).send({ ok: false, error: error.message });
			}
			return res.code(500).send({ ok: false, error: "Internal server error" });
		}
	}
}

export const NotifController = new notifController();