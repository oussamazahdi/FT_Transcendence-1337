import bcrypt from "bcrypt"

function getAllUsers(request, reply)
{
    try {
        const db = request.server.db;
        const users = db.prepare('SELECT id, firstname, lastname, username, email, profilepicture FROM users').all();
        return reply.code(200).send({message: "SUCCESS", data: users});
    }
    catch (error) {
        console.error(error.message);
        return reply.code(500).send({error: "INTERNAL_SERVER_ERROR"});
    }
}

function getOneUser(request, reply)
{
    try {
        const db = request.server.db;
        const user = db.prepare('SELECT id, firstname, lastname, username, email, profilepicture From users WHERE id = ?').get(request.params.id);
        if (!user)
            return reply.code(404).send({error: "USER_NOT_FOUND"});
        return reply.code(200).send({message: "SUCCESS", data: user});
    }
    catch (error) {
        return reply.code(500).send({error: "INTERNAL_SERVER_ERROR: error in getting one user"});
    }
}

async function updateUser(request, reply)
{
    try {
        const db = request.server.db;
        const user = db.prepare('SELECT id, firstname, lastname, username, email, password, profilePicture From users WHERE id = ?').get(request.params.id);
        if (!user)
            return reply.code(404).send({error: "USER_NOT_FOUND"});
        const firstname = request.body.firstname || user.firstname;
        const lastname = request.body.lastname || user.lastname;
        const username = request.body.username || user.username;
        const email = request.body.email || user.email;
        const password = (request.body.password) ? await bcrypt.hash(request.body.password, 12) : user.password;
        const profilePicture = request.body.profilePicture || user.profilePicture;
        
        const updated = db.prepare('UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, password = ?, profilePicture = ? WHERE id = ?')
        .run(firstname, lastname, username, email, password, profilePicture, request.params.id);
        
        return reply.code(204).send({message: "SUCCESS"});
    }
    catch (error)
    {
        return reply.code(500).send({error: "INTERNAL_SERVER_ERROR"});
    }
}

function deleteUser(request, reply)
{
    try {
        const db = request.server.db;
        const user = db.prepare('SELECT * From users WHERE id = ?').get(request.params.id);
        if (!user)
            return reply.code(404).send({error: "USER_NOT_FOUND"});
        const deleted = db.prepare('DELETE FROM users WHERE id = ?').run(request.params.id);
        
        return reply.code(204).send({message: "SUCCESS"});
    }
    catch (error)
    {
        return reply.code(500).send({error: "INTERNAL_SERVER_ERROR"});
    }
    
}

export { getAllUsers, getOneUser, updateUser, deleteUser }