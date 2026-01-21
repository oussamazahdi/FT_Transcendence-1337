import { handleDatabaseError } from '../utils/dbErrorHandler.js';

export class ChatModels
{
    // Conversations

    getConversation(db, userId, friendId)
    {
         try {
            const result = db.prepare(`
                SELECT id, last_message 
                FROM conversations
                WHERE
                (user_id = :me AND friend_id = :friend)
                OR
                (user_id = :friend AND friend_id = :me); `).get({me: userId, friend: friendId});
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getConversation');
            throw dbError;
        }
    }
    getAllConversations(db, userId, limit, offset)
    {
        try {
            const result = db.prepare(`
                SELECT u.firstname, u.lastname, u.avatar, c.last_message, c.updatedate 
                FROM conversations c
                JOIN users u ON u.id = CASE 
                    WHEN c.user_id = :me THEN c.friend_id
                    ELSE c.user_id
                END
                WHERE (user_id = :me OR friend_id = :me)
                LIMIT :limit
                OFFSET :offset
                `).all({me: userId, limit: limit, offset: offset});
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getAllConversations');
            throw dbError;
        }
    }

    getConversationById(db, userId, convId)
    {
        try {
            const result = db.prepare(`
                SELECT u.firstname, u.lastname, u.avatar, c.last_message, c.updatedate 
                FROM conversations c
                JOIN users u ON u.id = CASE 
                    WHEN c.user_id = :me THEN c.friend_id
                    ELSE c.user_id
                END
                WHERE (id = :convid) AND (c.user_id = :me OR c.friend_id = :me)
                `).get({me: userId, convid: convId});
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getConversationById');
            throw dbError;
        }
    }

    isUserInConversation(db, convId, userId)
    {
        try {
            const result = db.prepare(`
                SELECT 1
                FROM conversations 
                WHERE (id = :convid) AND (c.user_id = :uid OR c.friend_id = :uid)
                `).get({uid: userId, convid: convId});
            return (!!result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'isUserInConversation');
            throw dbError;
        }
    }

    searchConversationsByPairs(db, userId, query, limit, offset)
    {
        try {
            
            const result = db.prepare(`
            SELECT
                u.id AS friend_id,
                u.firstname, u.lastname, u.username, u.avatar,
                c.id AS conversation_id,
                c.last_message, c.updatedate
            FROM conversations c
            JOIN users u ON u.id = CASE
                WHEN c.user_id = :me THEN c.friend_id
                WHEN c.friend_id = :me THEN c.user_id
            END
            WHERE (c.user_id = :me OR c.friend_id = :me)
                AND (
                u.firstname LIKE '%' || :query || '%'
                OR u.lastname LIKE '%' || :query || '%'
                OR u.username LIKE '%' || :query || '%'
                )
            ORDER BY
                CASE
                WHEN u.username  LIKE '%' || :query || '%' THEN 1
                WHEN u.firstname LIKE '%' || :query || '%' THEN 2
                WHEN u.lastname  LIKE '%' || :query || '%' THEN 3
                ELSE 4
                END,
                c.updatedate DESC
                LIMIT :limit
                OFFSET :offset
            `).all({ me: userId, query: query, limit: limit, offset:  offset });
            return result;

        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'searchConversationsByPairs');
            throw dbError;
        }
    }

    createConversation(db, userId, friendId)
    {
        try {
            const result = db.prepare(`
                INSERT INTO conversations
                (user_id, friend_id)
                VALUES (?, ?)`).run(userId, friendId);
            return (result);

        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'createConversation');
            throw dbError; 
        }
    }
    
    UpdateLastMessage(db, userId, friendId)
    {
        try {
            const result = db.prepare(`
                UPDATE conversations
                SET
                last_message = (
                    SELECT m.content
                    FROM messages m
                    WHERE m.conversation_id = conversations.id
                    ORDER BY m.creationdate DESC
                    LIMIT 1
                ),
                updatedate = (
                    SELECT m.creationdate
                    FROM messages m
                    WHERE m.conversation_id = conversations.id
                    ORDER BY m.creationdate DESC
                    LIMIT 1
                )
                WHERE
                (user_id = :me AND friend_id = :friend)
                OR
                (user_id = :friend AND friend_id = :me);
                `).run({me: userId, friend: friendId });
            return (result);

        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'UpdateLastMessage');
            throw dbError; 
        }
    }

    getAllMessages(db, convId, userId, limit, offset)
    {
        try {
            const result = db.prepare(`
            SELECT
                m.id AS message_id,
                m.sender_id,
                u.avatar,
                m.content,
                m.creationdate
            FROM messages m
            JOIN users u ON u.id = m.sender_id
            JOIN conversations c ON c.id = m.conversation_id
            WHERE m.conversation_id = :convid
                AND (:me = c.user_id OR :me = c.friend_id)
            ORDER BY m.creationdate ASC
            LIMIT :limit
            OFFSET :offset
            `).all({ convid: convId, me: userId, limit, offset });

            return result;
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getAllMessages');
            throw dbError;
        }
    }


    createNewMessage(db, convId, senderId, content)
    {
        try {
            const result = db.prepare(`
                INSERT INTO messages
                (conversation_id, sender_id, content)
                VALUES (?, ?, ?)`).run(convId, senderId, content);
            return (result);

        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'createNewMessage');
            throw dbError; 
        }
    }

}


export const chatModels = new ChatModels();