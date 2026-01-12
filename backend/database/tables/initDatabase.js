import { createUserTable } from "./userTable.js"
import { createTokenTable } from "./tokenTable.js"
import { createFriendshipTable } from "./friendsTable.js"

function initAllTables(db)
{
    createUserTable(db);
    createTokenTable(db);
    createFriendshipTable(db);
}

export { initAllTables };