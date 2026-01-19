import { handleDatabaseError } from '../utils/dbErrorHandler.js';

/**
 * conversations Table :
 *          getAllConversations(db, userId)
 *          getConversationById(db, ConvId)
 *          isUserInConversation(db, ConvId, userId)
 *          searchConversationsByPairs(db, userId, friendId)
 * 
 *          createConversation(db, userId, FriendId)
 *          UpdateLastMessage(db, userId, FriendId)
 * messages Table
 *         getAllMessages(db, convId, userId, friendId)
 *         getLastMessage(db, convId, userId, friendId)
 *         sendmessage(db, convId, userId, content)
 *         countMessages(db, convId)
 *          
 * 
 */

export class ChatModels
{
    getAllConversations(db, userId)
    {
        try {
            const result = db.prepare(`
                SELECT u.firstname u.lastname u.avatar last_message updatedate 
                FROM conversations c
                JOIN users u ON u.id = CASE 
                    WHEN c.user_id = :me THEN c.friend_id
                    ELSE c.user_id
                END
                WHERE (user_id = :me OR friend_id = :me)
                `).all({me: userId});
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'addNewUser');
            throw dbError;
        }
    }

    getConversationById(db, userId, convId)
    {
        try {
            const result = db.prepare(`
                SELECT u.firstname u.lastname u.avatar last_message updatedate 
                FROM conversations c
                JOIN users u ON u.id = CASE 
                    WHEN c.user_id = :me THEN c.friend_id
                    ELSE c.user_id
                END
                WHERE (id = :convid)
                `).get({me: userId, convid: convId});
            return (result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'addNewUser');
            throw dbError;
        }
    }

    isUserInConversation(db, convId, friendId)
    {
        try {
            const result = db.prepare(`
                SELECT u.firstname u.lastname u.avatar last_message updatedate 
                FROM conversations c
                JOIN users u ON u.id = CASE 
                    WHEN c.user_id != :friend THEN c.friend_id
                    ELSE c.user_id
                END
                WHERE (id = :convid)
                `).get({friend: friendId, convid: convId});
            return (!!result);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'addNewUser');
            throw dbError;
        }
    }

    searchConversationsByPairs(db, userId, friendId)
    {
        try {
            const result = db.prepare(`
                SELECT u.firstname, u.lastname, u.avatar, c.last_message, c.updatedate 
                FROM conversations c
                JOIN users u ON u.id = CASE 
                    WHEN c.user_id = :me THEN c.friend_id
                    WHEN c.friend_id = :me THEN c.user_id
                END
                WHERE (c.user_id = :me AND c.friend_id = :friend) 
                OR (c.user_id = :friend AND c.friend_id = :me)
            `).get({me: userId, friend: friendId});
            return result;
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'searchConversationsByPairs');
            throw dbError;
        }
    }
}


export const chatModels = new ChatModels();