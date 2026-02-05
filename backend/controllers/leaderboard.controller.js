import { LeaderboardModels, leaderboardModels } from "../models/leaderboard.model.js"


export class LeaderboardController {
    async getRankingByXp(request, reply)
    {
        const db = request.server.db;

        try {

            const results = leaderboardModels.getPlayerByRanking(db);
            const count = leaderboardModels.countUsers(db);
            reply.code(200).send({message: "SUCCESS", totalUsers: count.count, result: results});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
}

export const leaderboardController = new LeaderboardController();