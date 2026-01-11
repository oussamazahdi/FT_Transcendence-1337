import { friendsModels } from "../models/friends.model.js";

export class FriendsController {

    async getAllFriends(request, reply)
    {
        const db = request.server.db;

        try {
            const friendsList = friendsModels.getFriendsList(db, request.user.userId);
            return reply.code(200).send({message: "SUCCESS", friendList: friendsList});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async getAllFriendRequests(request, reply)
    {
        const db = request.server.db;

        try {
            const requestsList = friendsModels.getRequestsList(db, request.user.userId);
            return reply.code(200).send({message: "SUCCESS", requestsList: requestsList});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    // check if blocked
    async sendFriendRequest(request, reply)
    {
        const db = request.server.db;

        try {
            const hasFriendship = friendsModels.isFriendshipExists(db, request.user.userId, request.params.id);
            const isBlocked = friendsModels.isBlockedByUser(db, request.user.userId, request.params.id);
            if (isBlocked && isBlocked.status === 'blocked')
                return (reply.code(401).send({error: "USER_IS_BLOCKED"}));
            if (hasFriendship)
                return (reply.code(409).send({error: "FRIENDSHIP_AREADY_EXISTS"}));
            const result = friendsModels.newFriendRequest(db, request.user.userId, request.params.id);
            if (result.changes === 0)
                return reply.code(409).send({error: "REQUEST_ALREADY_SENT"});
            return reply.code(200).send({message: "REQUEST_SENT_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async acceptFriendRequest(request, reply)
    {
        const db = request.server.db;

        try {
            const result = friendsModels.acceptFriendRequest(db, request.params.id, request.user.userId);
            if (result.changes === 0)
                return reply.code(409).send({ error: "REQUEST_NOT_FOUND" });
            return reply.code(200).send({message: "REQUEST_ACCEPTED_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

    async getAllBlocked(request, reply)
    {
        const db = request.server.db;

        try {
            const blockedUsers = friendsModels.getBlockedUsersList(db, request.user.userId);
            return reply.code(200).send({message: "SUCCESS", blockedUsers: blockedUsers});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

    async block(request, reply)
    {
        const db = request.server.db;

        try {
            const result = friendsModels.blockFriend(db, request.user.userId, request.params.id);
            if (result.changes === 0)
                return reply.code(409).send({ error: "USER_ALREADY_BLOCKED" });
            return reply.code(200).send({message: "USER_BLOCKED_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async unblock(request, reply)
    {
        const db = request.server.db;

        try {
            const result = friendsModels.unblockFriend(db, request.user.userId, request.params.id);
            if (result.changes === 0)
                return reply.code(409).send({ error: "USER_ALREADY_UNBLOCKED" });
            return reply.code(200).send({message: "USER_UNBLOCKED_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

    async cancelFriendRequest(request, reply)
    {
         const db = request.server.db;

        try {
            const result = friendsModels.removeFriendRequest(db, request.user.userId, request.params.id);
            if (result.changes === 0)
                return reply.code(409).send({ error: "REQUEST_ALREADY_CANCELED" });
            return reply.code(200).send({message: "REQUEST_CANCLED_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    

    async unfriend(request, reply)
    {
        const db = request.server.db;

        try {
            const result = friendsModels.removeFromFriendList(db, request.user.userId, request.params.id);
            if (result.changes === 0)
                return reply.code(409).send({ error: "USER_ALREADY_UNFRIENDED" });
            return reply.code(200).send({message: "USER_UNFRIENDED_SUCCESSFULLY"});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

}

export const friendsController = new FriendsController();