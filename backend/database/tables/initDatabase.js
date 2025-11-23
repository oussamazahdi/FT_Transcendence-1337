import { createUserTable } from "./userTable.js"
import { createTokenTable } from "./tokenTable.js"

function initAllTables(db)
{
    createUserTable(db);
    createTokenTable(db);
}

export { initAllTables };