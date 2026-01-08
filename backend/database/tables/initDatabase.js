import { createUserTable } from "./userTable.js"
import { createTokenTable } from "./tokenTable.js"
import { createNotificationsTable } from "./notificationsTable.js";

function initAllTables(db)
{
		createUserTable(db);
		createTokenTable(db);
		createNotificationsTable(db);
}

export { initAllTables };