export const NOTIFICATION_TYPES = {
	GAME_INVITE: "game_invite",
	GAME_ACCEPT: "game_accept",
	GAME_REJECT: "game_reject",
	FRIEND_REQUEST: "friend_request",
	FRIEND_ACCEPT: "friend_accept",
	SYSTEM: "system",
};

export const GAME_TYPES = ["pingpong", "tic_tac_toe"];

export const NotificationRules = {
  game_invite: {
    actionable: true,
    expiresInSeconds: 20,
    initialStatus: "pending",
    allowedActions: ["accept", "reject"],
    validTransitions: ["accepted", "rejected", "expired"],
    requiredPayload: ["roomId", "gameType"],
    allowedGameTypes: GAME_TYPES,
  },

  game_accept: {
    actionable: false,
    initialStatus: "pending",
    requiredPayload: [],
  },

  game_reject: {
    actionable: false,
    initialStatus: "pending",
    requiredPayload: [],
  },
};

