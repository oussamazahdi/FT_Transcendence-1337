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
		created_at: { type: "string" }
	}
};

export const notificationsSuccessResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
    userData: {
      type: "array",
      items: notificationSchema
    }
  }
};

