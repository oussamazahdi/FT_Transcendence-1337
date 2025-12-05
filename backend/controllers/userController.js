import bcrypt from "bcrypt"
import { type } from "os";

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

//addes by soufiix

function searchUsers(request, reply){
	try{
		const db = request.server.db;
		const { query } = request.query;

		console.log(query);
		if (!query || typeof query !== 'string'){
			return reply.code(400).json({ error: 'QUERY_PARAMETER_REQUERED' });
		}

		const trimmedQuery = query.trim();

		if (trimmedQuery.length < 2) {
			return reply.code(400).json({ error: 'QUERY_TOO_SHORT' });
		}

		if (trimmedQuery.length > 20) {
      return reply.code(400).json({ error: 'QUERY_TOO_LONG' });
    }

		const searchPattern = `%${trimmedQuery}%`;
		const startsWithPattern = `${trimmedQuery}%`;

		// add AND id != the userId later 
    const statement = db.prepare(`
      SELECT id, firstname, lastname, username, email, profilepicture
      FROM users
      WHERE (
        firstname LIKE ? OR
        lastname LIKE ? OR
        username LIKE ?
      )
      ORDER BY
        CASE
          WHEN firstname LIKE ? THEN 1
          WHEN lastname LIKE ? THEN 2
          WHEN username LIKE ? THEN 3
          ELSE 4
        END,
        firstname ASC
      LIMIT ?
    `);

    const results = statement.all(
      searchPattern,
      searchPattern,
      searchPattern,
      startsWithPattern,
      startsWithPattern,
      startsWithPattern,
      5
    );

    const formattedResults = results.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      profilepicture: user.profilepicture,
      fullName: `${user.firstname} ${user.lastname}`
    }));

    return reply.code(200).send(formattedResults);
		// reply.send("m3alem");
	}catch(error){
		console.error('searchUsers error:', error);
		return reply.code(500).send({ error:"INTERNAL_SERVER_ERROR" })
	}

}


export { getAllUsers, getOneUser, updateUser, deleteUser, searchUsers }