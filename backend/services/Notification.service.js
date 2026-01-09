import { NotificationRules } from "../rules/notifications.rules.js";
import { NotifModel } from "../models/notif.model.js";

const model = new NotifModel();

export function httpError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function hasRequiredPayload(payload = {}, rule = {}) {
  const required = rule.requiredPayload;
  if (!Array.isArray(required) || required.length === 0) return true;
  for (const field of required) {
    if (payload?.[field] === undefined) return false;
  }
  return true;
}

function safeParsePayload(payload) {
  if (payload == null) return null;
  if (typeof payload === "object") return payload;
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function getExpirationDate(rule = {}) {
  if (!rule.expiresInSeconds) return null;
  return new Date(Date.now() + rule.expiresInSeconds * 1000);
}

function isExpired(notif) {
  if (!notif?.expires_at) return false;
  const t = new Date(notif.expires_at).getTime();
  return Number.isFinite(t) && t < Date.now();
}

function validateRulePayload(rule, payload) {
  if (rule?.allowedGameTypes) {
    const gt = payload?.gameType;
    if (!rule.allowedGameTypes.includes(gt)) {
      throw httpError(400, `Invalid gameType: ${gt}`);
    }
  }
}

export class NotifServices {
  async create(db, { senderId, receiverId, type, title, message, payload = {} }) {
    const rule = NotificationRules[type];
    if (!rule) throw httpError(400, `Invalid notification type: ${type}`);
    if (!hasRequiredPayload(payload, rule)) throw httpError(400, "Missing payload field");

    validateRulePayload(rule, payload);

    const expiresAt = getExpirationDate(rule);

    const inserted = await model.create(db, {
      senderId,
      receiverId,
      type,
      title,
      message,
      payload: JSON.stringify(payload ?? {}),
      expiresAt,
    });

    if (!inserted?.id) throw httpError(500, "Failed to create notification");

    const row = await model.getById(db, inserted.id);
    return row ? { ...row, payload: safeParsePayload(row.payload) } : inserted;
  }

  async getForUser(db, userId, { expireOnFetch = true } = {}) {
    if (userId == null) throw httpError(400, "Missing userId");

    const rows = (await model.getForUser(db, userId)) || [];

    if (!expireOnFetch) {
      return rows.map((r) => ({ ...r, payload: safeParsePayload(r.payload) }));
    }

    const out = [];
    for (const r of rows) {
      let row = r;

      if (row?.status === "pending" && isExpired(row)) {
        await model.updateStatus(db, row.id, "expired");
        await model.markAsRead(db, row.id);
        row = (await model.getById(db, row.id)) || { ...row, status: "expired" };
      }

      out.push({ ...row, payload: safeParsePayload(row.payload) });
    }

    return out;
  }

  async getById(db, id) {
    const row = await model.getById(db, id);
    return row ? { ...row, payload: safeParsePayload(row.payload) } : null;
  }

  async markAsRead(db, { id, userId } = {}) {
    const notif = await model.getById(db, id);
    if (!notif) throw httpError(404, "Notification not found");
    if (userId != null && notif.receiver_id !== userId) throw httpError(403, "Forbidden");

    await model.markAsRead(db, id);
    const updated = (await model.getById(db, id)) || notif;
    return { ...updated, payload: safeParsePayload(updated.payload) };
  }

  async act(db, { id, userId, action }) {
    const notif = await model.getById(db, id);
    if (!notif) throw httpError(404, "Notification not found");
    if (notif.receiver_id !== userId) throw httpError(403, "Forbidden");

    const rule = NotificationRules[notif.type];
    if (!rule) throw httpError(400, `Invalid notification type: ${notif.type}`);
    if (!rule.actionable) throw httpError(400, "Notification is not actionable");
    if (!rule.allowedActions?.includes(action)) throw httpError(400, `Action not allowed: ${action}`);

    if (notif.status === "pending" && isExpired(notif)) {
      await model.updateStatus(db, id, "expired");
      await model.markAsRead(db, id);
      throw httpError(409, "Notification expired");
    }

    const nextStatus = action === "accept" ? "accepted" : action === "reject" ? "rejected" : null;
    if (!nextStatus) throw httpError(400, "Invalid action");
    if (!rule.validTransitions?.includes(nextStatus)) throw httpError(400, "Invalid status transition");

    await model.updateStatus(db, id, nextStatus);
    await model.markAsRead(db, id);

    const updated = await model.getById(db, id);
    return { ...updated, payload: safeParsePayload(updated?.payload) };
  }

  async updateStatus(db, id, action, userId) {
    return this.act(db, { id, userId, action });
  }

	async createGameInvitation(db, { senderId, receiverId, roomId, gameType }){
		return await this.create(db, { senderId, receiverId,
			type:"game_invite",
			title: "Game invite",
    	message: "You received a game invite",
    	payload: { roomId, gameType }, });
	}
}
