function getSafeUserData(database, id)
{
    const userObj = database.prepare('SELECT firstname, lastname, username, email, avatar FROM users WHERE id = ?')
        .get(id);
    return userObj;
}

export { getSafeUserData }