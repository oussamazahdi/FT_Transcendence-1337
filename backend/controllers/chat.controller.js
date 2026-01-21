import { chatModels } from "../models/chat.model.js";


export class chatController 
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
        const { page = 1 } = request.query;
        const pageNum = Math.max(1, Number(page));
        const limit = 10;
        const offset = (pageNum - 1) * limit;

        try {
            const conversations = chatModels.getAllConversations(db, request.user.userId, limit, offset);
            return reply.code(200).send({message: "SUCCESS", page: pageNum, limit: limit, conversations: conversations});
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
        const limit = 10;
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
}