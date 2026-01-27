import { handleDatabaseError } from '../utils/dbErrorHandler.js';

export class FriendsModels
{
    getFriendsList(db, userId)
    {
        try {
            const friends = db.prepare(`
                SELECT u.id, u.username, u.avatar, u.firstname, u.lastname
                FROM friends f
                JOIN users u ON u.id = CASE 
                    WHEN f.sender_id = :me THEN f.receiver_id
                    ELSE f.sender_id
                END
                WHERE ((f.sender_id = :me OR f.receiver_id = :me) AND f.status = 'accepted')
                `).all({me : userId});
            return (friends);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getFriendsList');
            throw dbError;
        }
    }

    searchFriends(db, userId, query, limit, offset)
    {
        try {
            const result = db.prepare(`
                SELECT u.id, u.username, u.avatar, u.firstname, u.lastname
                FROM friends f
                JOIN users u ON CASE
                    WHEN f.sender_id = :me THEN f.receiver_id
                    ELSE f.sender_id
                WHERE
                    (
                        (f.sender_id = :me
                        OR f.receiver_id = :me)
                        AND f.status = 'accepted'
                    )
                    OR firstname LIKE '%' || :query || '%'
                    OR lastname LIKE '%' || :query || '%'
                    OR username LIKE '%' || :query || '%'
                ORDER BY
                    CASE 
                        WHEN firstname LIKE '%' || :query || '%' THEN 1
                        WHEN lastname LIKE '%' || :query || '%' THEN 2
                        WHEN username LIKE '%' || :query || '%' THEN 3
                    END
                LIMIT :limit
                OFFSET :offset
                `).all({me: userId, query: query, limit: limit, offset: offset});
            return (result)
        }
        catch (error)
        {
            const dbError = handleDatabaseError(error, 'searchUsers');
            throw dbError;
        }
    }

    getRequestsList(db, userId)
    {
        try {
            const requests = db.prepare(`
                SELECT u.id, u.username, u.avatar, u.firstname, u.lastname
                FROM friends f
                JOIN users u ON u.id = f.sender_id
                WHERE f.receiver_id = :me AND f.status = 'pending'
                `).all({me : userId});
            return (requests);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getRequestsList');
            throw dbError;
        }
    }

    getSentRequestsList(db, userId)
    {
        try {
            const requests = db.prepare(`
                SELECT u.id, u.username, u.avatar, u.firstname, u.lastname
                FROM friends f
                JOIN users u ON u.id = f.receiver_id
                WHERE f.sender_id = :me AND f.status = 'pending'
                `).all({me : userId});
            return (requests);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getSentRequestsList');
            throw dbError;
        }
    }

    getBlockedUsersList(db, userId)
    {
        try {
            const blockedList = db.prepare( `
                SELECT u.id, u.username, u.avatar, u.firstname, u.lastname 
                FROM friends f JOIN users u 
                ON u.id = CASE 
                WHEN f.sender_id = :me THEN f.receiver_id 
                ELSE f.sender_id 
                END 
                WHERE f.blocked_by = :me AND f.status = 'blocked' `).all({me : userId}); 
                return (blockedList);
            } 
            catch (error) {
                const dbError = handleDatabaseError(error, 'getBlockedUsersList');
                throw dbError; 
            }
    }

    newFriendRequest(db, senderId, receiverId)
    {
        try {
            const result = db.prepare(`
                INSERT INTO friends
                (sender_id, receiver_id, status)
                VALUES (?, ?, ?)`).run(senderId, receiverId, 'pending');
            return (result);

        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'newFriendRequest');
            throw dbError; 
        }
    }

    acceptFriendRequest(db, sender_id, receiver_id)
    {
        try {
            const result = db.prepare(`
                UPDATE friends SET status = 'accepted' 
                WHERE (sender_id = :other AND receiver_id = :me AND status = 'pending')`).run({me: receiver_id, other: sender_id});
            return (result);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'acceptFriendRequest');
            throw dbError; 
        }
    }

    blockFriend(db, blocker, blocked)
    {
        try {
            let result = db.prepare(`
                UPDATE friends SET status = 'blocked', blocked_by = :me
                WHERE (
                (receiver_id = :me AND sender_id = :other) 
                OR
                (receiver_id = :other AND sender_id = :me))
                AND status != 'blocked'`).run({me: blocker, other: blocked});
            if (result.changes === 0)
            {
                result = db.prepare(`
                INSERT INTO friends
                (sender_id, receiver_id, status, blocked_by)
                VALUES (?, ?, ?, ?)`).run(blocker, blocked, 'blocked', blocker);
            }
            return (result);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'blockFriend');
            throw dbError; 
        }
    }

    unblockFriend(db, blocker, blocked)
    {
        try {
            const result = db.prepare(`
                DELETE FROM friends
                WHERE (
                (receiver_id = :me AND sender_id = :other) 
                OR
                (receiver_id = :other AND sender_id = :me))
                AND blocked_by = :me`).run({me: blocker, other: blocked});
            return (result);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'unblockFriend');
            throw dbError; 
        }
    }

    removeFriendRequest(db, sender, receiver)
    {
        try {
            const result = db.prepare(`
                DELETE FROM friends 
                WHERE (
                (sender_id = :me AND receiver_id = :other)
                OR
                (sender_id = :other AND receiver_id = :me))
                AND status = 'pending'`).run({me: sender, other: receiver});
            return (result);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'removeFriendRequest');
            throw dbError; 
        }
    }
    
    removeFromFriendList(db, sender, receiver)
    {
        try {
            const result = db.prepare(`
                DELETE FROM friends 
                WHERE (
                (sender_id = :me AND receiver_id = :other)
                OR
                (sender_id = :other AND receiver_id = :me))
                AND status = 'accepted'`).run({me: sender, other: receiver});
            return (result);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'removeFromFriendList');
            throw dbError; 
        }
    }

    isBlockedByUser(db, blocker, blocked)
    {
        try {
            const relation = db.prepare(`
                SELECT status, blocked_by FROM friends
                WHERE (
                (sender_id = :me AND receiver_id = :other)
                OR
                (sender_id = :other AND receiver_id = :me))
                `).get({me: blocker, other: blocked});
            if (relation.status === 'blocked')
                return (true);
            return (false);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'isBlockedByUser');
            throw dbError; 
        }
    }

    isFriendshipExists(db, sender, receiver)
    {
        try {
            const result = db.prepare(`SELECT status FROM friends
                WHERE (sender_id = :me AND receiver_id = :other)
                OR
                (sender_id = :other AND receiver_id = :me)`).get({me: sender, other: receiver});
            if (result === undefined)
                return (false);
            return (true);
        }
        catch (error) 
        {
            const dbError = handleDatabaseError(error, 'isBlockedByUser');
            throw dbError; 
        }
    }

    
    }
export const friendsModels = new FriendsModels();