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
    
    async sendFriendRequest(request, reply)
    {
        const db = request.server.db;

        try {
            const result = friendsModels.newFriendRequest(db, request.user.userId, request.params.id);
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
            const result = friendsModels.blockFriend(db, request.user.userId, request.params.id);
            return reply.code(200).send({message: "USER_BLOCKED_SUCCESSFULLY"});
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