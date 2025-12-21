export function handleDatabaseError(error, context = '') {
    console.error(`[DB ERROR in ${context}]:`, error.message);

    if (error.message.includes('UNIQUE constraint failed'))
    {
        if (error.message.includes('users.email'))
            return { code: 409, message: 'EMAIL_ALREADY_EXISTS' };

        if (error.message.includes('users.username'))
            return { code: 409, message: 'USERNAME_ALREADY_TAKEN' };

        return { code: 409, message: 'DUPLICATE_ENTRY' };
    }

    if (error.message.includes('NOT NULL constraint failed')) 
    {
        const match = error.message.match(/NOT NULL constraint failed: (\w+)\.(\w+)/);
        if (match) 
        {
            const field = match[2];
            return { code: 400, message: `MISSING_REQUIRED_FIELD_${field.toUpperCase()}` };
        }
        return { code: 400, message: 'MISSING_REQUIRED_FIELD' };
    }

    if (error.message.includes('FOREIGN KEY constraint failed'))
        return { code: 400, message: 'INVALID_REFERENCE' };

    if (error.code === 'SQLITE_BUSY' || error.message.includes('database is locked'))
        return { code: 503, message: 'DATABASE_BUSY' };

    if (error.message.includes('no such table') || error.message.includes('no such column')) 
    {
        console.error('CRITICAL: Database schema error!');
        return { code: 500, message: 'INTERNAL_SERVER_ERROR' };
    }

    return { code: 500, message: 'DATABASE_ERROR' };
}