export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        avatar: { type: ['string', 'null'] },
        isEmailVerified: { type: 'boolean' }
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