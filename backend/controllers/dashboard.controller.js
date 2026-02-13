import { dashboardModels } from "../models/dashboard.model.js";



export class DashboardController {
    async allTimeStatistics(request, reply)
    {
        const db = request.server.db;
        try {

            const results = dashboardModels.getWinLoseForfait(db, request.user.userId);
            reply.code(200).send({message: "SUCCESS", data: results});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
    
    async weeklyStatistics(request, reply)
    {
        const db = request.server.db;
        try {
            const { userId } = request.query;
            const results = dashboardModels.getWinsLosesTotalPerDay(db, Number(userId));
            reply.code(200).send({message: "SUCCESS", data: results});
        }
        catch (error) {
            if (error.code)
                return reply.code(error.code).send({error: error.message});
            else
                return reply.code(500).send({error: error.message});
        }
    }
}


export const dashboardController = new DashboardController();