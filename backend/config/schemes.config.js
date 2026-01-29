// User Auth

// Full user - for /auth/me, own profile
export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        avatar: { type: ['string', 'null'] },
        isverified: { type: 'integer' },
        status2fa: { type: 'integer' },
    }
};

// Public user 
export const publicUserSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        avatar: { type: ['string', 'null'] },
    }
};

// Minimal user 
export const minimalUserSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        avatar: { type: ['string', 'null'] },
    }
};

// response success and error

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
};

export const nestedObjectSuccessResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        userData: {
            type: 'array',
            items: publicUserSchema
        }
    }
};

// Params & queries

export const idParamSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer', minimum: 1 }
    }
};

export const paginationQuerySchema = {
    type: 'object',
    properties: {
        page: { type: 'integer', minimum: 1, default: 1 }
    }
};

export const searchQuerySchema = {
    type: 'object',
    properties: {
        q: { type: 'string', default: '' },
        page: { type: 'integer', minimum: 1, default: 1 }
    }
};

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

// friends

export const minimalUserArraySchema = {
    type: 'array',
    items: minimalUserSchema
};

export const friendsListResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        friendList: minimalUserArraySchema
    }
};

export const friendRequestsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        requestsList: minimalUserArraySchema
    }
};

export const sentFriendRequestsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        Requests: minimalUserArraySchema
    }
};

export const blockedUsersResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        blockedUsers: minimalUserArraySchema
    }
};

export const friendsSearchResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        friends: minimalUserArraySchema
    }
};

// chat

export const conversationSchema = {
    type: 'object',
    properties: {
        userid: { type: 'integer' },
        convid: { type: 'integer' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        avatar: { type: ['string', 'null'] },
        last_message: { type: ['string', 'null'] },
        updatedate: { type: ['string', 'null'] }
    }
};

export const conversationSearchSchema = {
    type: 'object',
    properties: {
        friend_id: { type: 'integer' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        username: { type: 'string' },
        avatar: { type: ['string', 'null'] },
        conversation_id: { type: 'integer' },
        last_message: { type: ['string', 'null'] },
        updatedate: { type: ['string', 'null'] }
    }
};

export const messageSchema = {
    type: 'object',
    properties: {
        message_id: { type: 'integer' },
        sender_id: { type: 'integer' },
        avatar: { type: ['string', 'null'] },
        content: { type: 'string' },
        creationdate: { type: 'string' }
    }
};

export const allConversationsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        conversations: {
            type: 'array',
            items: conversationSchema
        }
    }
};

export const searchConversationsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        conversations: {
            type: 'array',
            items: conversationSearchSchema
        }
    }
};

export const messagesQuerySchema = {
    type: 'object',
    required: ['friendId'],
    properties: {
        friendId: { type: 'integer' },
        page: { type: 'integer', minimum: 1, default: 1 }
    }
};

export const allMessagesResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        messages: {
            type: 'array',
            items: messageSchema
        }
    }
};

// game

export const gameSettingsSchema = {
    type: 'object',
    properties: {
        player_id: { type: 'integer' },
        player_xp: { type: 'integer' },
        player_level: { type: 'integer' },
        game_mode: { type: 'string' },
        ball_speed: { type: 'integer' },
        score_limit: { type: 'integer' },
        paddle_size: { type: 'integer' },
        updated_at: { type: 'string' }
    }
};

export const gameSettingsResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        settings: gameSettingsSchema
    }
};

export const updateGameSettingsBody = {
    type: 'object',
    properties: {
        player_xp: { type: 'integer' },
        player_level: { type: 'integer' },
        game_mode: { type: 'string' },
        ball_speed: { type: 'integer', minimum: 1, maximum: 3 },
        score_limit: { type: 'integer', minimum: 5, maximum: 20 },
        paddle_size: { type: 'integer', minimum: 1, maximum: 3 }
    }
};

export const matchHistorySchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        player1_id: { type: 'integer' },
        player2_id: { type: 'integer' },
        player1_score: { type: 'integer' },
        player2_score: { type: 'integer' },
        winner_id: { type: ['integer', 'null'] },
        status: { type: 'string' },
        created_at: { type: 'string' }
    }
};

export const matchHistoryResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        data: {
            type: 'array',
            items: matchHistorySchema
        }
    }
};

// notifs

export const notificationSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        sender_id: { type: 'integer' },
        receiver_id: { type: 'integer' },
        type: { type: 'string' },
        title: { type: 'string' },
        message: { type: 'string' },
        payload: { type: ['object', 'null'] },
        status: { type: 'string' },
        is_read: { type: 'integer' },
        expires_at: { type: ['string', 'null'] },
        created_at: { type: 'string' }
    }
};

export const notificationsSuccessResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        userData: {
            type: 'array',
            items: notificationSchema
        }
    }
};

export const unreadCountResponse = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        unreadCount: { type: 'integer' }
    }
};

export const userArraySchema = minimalUserArraySchema;