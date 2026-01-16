import { createUserTable } from "./userTable.js"
import { createTokenTable } from "./tokenTable.js"
import { createFriendshipTable } from "./friendsTable.js"
import { createNotificationsTable } from "./notificationsTable.js";
import { createMatchHistoryTable } from "./matchHistoryTable.js";


function initAllTables(db)
{
		createUserTable(db);
		createTokenTable(db);
    createFriendshipTable(db);
		createNotificationsTable(db);
		createMatchHistoryTable(db);
}

export { initAllTables };