import { chatModels } from "../models/chat.model.js";
import { friendsModels } from "../models/friends.model.js";
import { userModels } from "../models/user.model.js";


export class ChatController 
{
    async searchConversations(request, reply)
    {
        const db = request.server.db;
        const { q = "", page = 1 } = request.query;
        const pageNum = Math.max(1, Number(page));
        const limit = 10;
        const offset = (pageNum - 1) * limit;

        try {
            const conversations = chatModels.searchConversationsByPairs(db, request.user.userId, q, limit, offset);
            return reply.code(200).send({message: "SUCCESS", page: pageNum, limit: limit, conversations: conversations});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

    async getAllConversations(request, reply)
    {
        const db = request.server.db;

        try {
            const conversations = chatModels.getAllConversations(db, request.user.userId);
            return reply.code(200).send({message: "SUCCESS", conversations: conversations});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

    async getAllMessages(request, reply)
    {
        const db = request.server.db;
        const { page = 1, friendId } = request.query;
        const pageNum = Math.max(1, Number(page));
        const limit = 30;
        const offset = (pageNum - 1) * limit;

        try {
            if (!friendId)
                return reply.code(400).send({error: "FRIEND_ID_IS_REQUIRED"});
            const conv = chatModels.getConversation(db, request.user.userId, friendId);
            const messages = chatModels.getAllMessages(db, conv.id, request.user.userId, limit, offset);
            return reply.code(200).send({message: "SUCCESS", page: pageNum, limit: limit, messages: messages});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }

    sendMessage(socket, server, data)
    {
        /**
         * Payload must be : 
         * {
         *      receiverId : 5,
         *      content : "Hello There"
         * }
         */
        const senderId = socket.user.userId;
        const db = server.db;
        try {
            if (!data.receiverId)
                socket.emit("chat:error", {message: "NO_RECEIVER_PROVIDED"});
            if (data.content.length > 500 || !data.content)
                socket.emit("chat:error", {message: "SOMETHING_WRONG_WITH_MESSAGE"});
            const receiverId = data.receiverId;
            const friendshipStatus = friendsModels.isFriendshipExists(db, senderId, receiverId);
            const blocked = friendsModels.isBlockedByUser(db, senderId, receiverId);
            if (!friendshipStatus || blocked.status)
                socket.emit("chat:error", {message: "NOT_ALLOWED_TO_CONTACT_USER"});
            if (senderId === receiverId)
                socket.emit("chat:error", {message: "NOT_ALLOWED_TO_CONTACT_YOURSELF"});
            const convId = chatModels.getOrCreateConversationId(db, senderId, receiverId);
            const msgId = chatModels.createNewMessage(db, convId, senderId, data.content);
            // console.log("heeere is the is", msgId)
            chatModels.UpdateLastMessage(db, senderId, receiverId);
            const conversation = chatModels.getConversationById(db, senderId, convId);
            const payload = {
                msgId: msgId,
                senderId: senderId,
                avatar: conversation.avatar,
                content: conversation.last_message,
                sentAt: conversation.updatedate
            }
            socket.to(`chat:${receiverId}`).emit("chat:receiver", payload);
        }
        catch(error) {
            // if (error.code)
                socket.emit("chat:error", { message: error.message || "Internal Server Error" });
        }
        console.log(senderId, data.content);
    }
}

export const chatController = new ChatController();