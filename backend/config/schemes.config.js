export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        avatar: { type: ['string', 'null'] },
        isverified: { type: 'integer'},
        status2fa: { type: 'integer'}
    }
};
export const errorResponse = {
    type: 'object',
    properties: {
        error: { type: 'string' }
    }
};

export const emptySuccessResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' }
    }
};

export const objectSuccessResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        userData: userSchema
    }
}

export const nestedObjectSuccessResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        userData: {
            type: 'array',
            items: userSchema
        }
    }
    
}

// 2FA
export const twoFaSetupResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        qr: { type: 'string' }
    }
};

export const twoFaTokenBody = {
    type: 'object',
    required: ['token'],
    properties: {
        token: { type: 'string', pattern: '^[0-9]{6}$' }
    }
};

// Friends
export const userArraySchema = {
    type: 'array',
    items: userSchema
};

export const friendsListResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        friendList: userArraySchema
    }
};

export const friendRequestsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        requestsList: userArraySchema
    }
};

export const sentFriendRequestsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        Requests: userArraySchema
    }
};
export const blockedUsersResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        blockedUsers: userArraySchema
    }
};

export const idParamSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer', minimum: 1 }
    }
};

export const notificationSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		sender_id: { type: "integer" },
		receiver_id: { type: "integer" },
		type: { type: "string" },
		title: { type: "string" },
		message: { type: "string" },
		payload: { type: ["object", "null"] },
		status: { type: "string" },
		is_read: { type: "integer" },
		expires_at: { type: ["string", "null"] },
		created_at: { type: "string" },
		is_expired: { type: "integer", enum: [0, 1] },
		sender_username: { type: ["string", "null"] },
    sender_avatar: { type: ["string", "null"], format: "uri" }
	}
};

export const notificationsSuccessResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
    notifications: {
      type: "array",
      items: notificationSchema
    }
  }
};

