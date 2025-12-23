import Sqlite3 from "better-sqlite3";

export function createDatabase() {
    return new Sqlite3('./database/transcendence.db', { 
        verbose: console.log
    });
}