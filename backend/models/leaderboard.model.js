import { handleDatabaseError } from '../utils/dbErrorHandler.js';


export class LeaderboardModels {

    //chsnge this line : WHEN (m.player1_id = u.id OR m.player2_id = u.id) AND status = 'lose'

    getPlayerByRanking(db, limit, offset)
    {
         try {
            const ranking = db.prepare(`
                SELECT  u.id,
                        u.username,
                        u.avatar,
                        u.firstname,
                        u.lastname,
                        s.player_xp,
                        s.player_level,

                        COUNT(CASE 
                            WHEN (m.player1_id = u.id OR m.player2_id = u.id) AND (status = 'win' AND m.winner_id = u.id)
                            THEN 1 END) AS wins,
                        COUNT(CASE 
                            WHEN (m.player1_id = u.id OR m.player2_id = u.id) AND (status = 'win' AND m.winner_id != u.id)
                            THEN 1 END) AS loses,
                        COUNT(CASE 
                            WHEN (m.player1_id = u.id OR m.player2_id = u.id) AND status = 'forfait'
                            THEN 1 END) AS forfaits
                FROM game_settings s
                JOIN users u ON u.id = s.player_id
                LEFT JOIN match_history m ON s.player_id IN (player1_id, player2_id)

                GROUP BY
                    u.id,
                    u.username,
                    u.avatar,
                    u.firstname,
                    u.lastname,
                    s.player_xp,
                    s.player_level

                ORDER BY
                    s.player_xp DESC
                LIMIT :limit
                OFFSET :offset;
                `).all({limit: limit, offset: offset});
            return (ranking);
        }
        catch (error) {
            const dbError = handleDatabaseError(error, 'getPlayerByRanking');
            throw dbError;
        }
    }
    
    countUsers(db)
    {
        try {
           const count = db.prepare(`SELECT COUNT(*) AS count FROM game_settings`).get();
           return (count);
       }
       catch (error) {
           const dbError = handleDatabaseError(error, 'countUsers');
           throw dbError;
       }

    }

}

export const leaderboardModels = new LeaderboardModels();