import { handleDatabaseError } from '../utils/dbErrorHandler.js';


export class DashboardModels {
    getWinsLosesTotalPerDay(db, userId)
    {
        try {
           const result = db.prepare(`
            SELECT
                DATE(mh.created_at) AS day,
                COUNT(CASE WHEN (mh.winner_id = :me) THEN 1 END) AS wins,
                COUNT(CASE WHEN (mh.winner_id != :me) THEN 1 END) AS loses,
                COUNT(*) AS total
            FROM match_history mh
            WHERE mh.created_at >= DATE('now', '-7 days')
            AND :me  IN (mh.player1_id, mh.player2_id)
            GROUP BY day
            ORDER BY day;
            `).all({me: userId});
           return (result);
       }
       catch (error) {
           const dbError = handleDatabaseError(error, 'getWinsLosesPerDay');
           throw dbError;
       }
    }

    getWinLoseForfait(db, userId)
    {
        try {
           const result = db.prepare(`
            SELECT
                COUNT(CASE WHEN (mh.winner_id = :me AND mh.status = 'win') THEN 1 END) AS wins,
                COUNT(CASE WHEN (mh.winner_id != :me AND mh.status = 'win') THEN 1 END) AS loses,
                COUNT(CASE WHEN (mh.winner_id != :me AND mh.status = 'forfait') THEN 1 END) AS lose_forfaits,
                COUNT(CASE WHEN (mh.winner_id = :me AND mh.status = 'forfait') THEN 1 END) AS win_forfaits,
                COUNT(*) AS total
            FROM match_history mh
            WHERE :me  IN (mh.player1_id, mh.player2_id)
            `).all({me: userId});
           return (result);
       }
       catch (error) {
           const dbError = handleDatabaseError(error, 'getWinLoseForfait');
           throw dbError;
       }
    }
}


export const dashboardModels = new DashboardModels();