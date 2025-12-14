import bcrypt from "bcrypt"


export class UserController 
{
	getAllUsers(request, reply)
	{
		try {
			const db = request.server.db;
			const users = db.prepare('SELECT id, firstname, lastname, username, email, avatar FROM users').all();
			return reply.code(200).send({message: "SUCCESS", data: users});
		}
		catch (error) {
			return reply.code(500).send({error: error.message});
		}
	}
	
	getOneUser(request, reply)
	{
		try {
			const db = request.server.db;
			const user = db.prepare('SELECT id, firstname, lastname, username, email, avatar From users WHERE id = ?').get(request.params.id);
			if (!user)
				return reply.code(404).send({error: "USER_NOT_FOUND"});
			return reply.code(200).send({message: "SUCCESS", data: user});
		}
		catch (error) {
			return reply.code(500).send({error: error.message});
		}
	}
	
	async  updateUser(request, reply)
	{
		try {
			const db = request.server.db;
			if (request.user.userId !== parseInt(request.params.id))
				return reply.code(403).send({error: "FORBIDDEN"});
			const user = db.prepare('SELECT id, firstname, lastname, username, email, password, avatar From users WHERE id = ?').get(request.params.id);
			if (!user)
				return reply.code(404).send({error: "USER_NOT_FOUND"});
			const firstname = request.body.firstname || user.firstname;
			const lastname = request.body.lastname || user.lastname;
			const username = request.body.username || user.username;
			const email = request.body.email || user.email;
			const password = (request.body.password) ? await bcrypt.hash(request.body.password, 12) : user.password;
			const avatar = request.body.avatar || user.avatar;
			
			const updated = db.prepare('UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, password = ?, avatar = ? WHERE id = ?')
			.run(firstname, lastname, username, email, password, avatar, request.params.id);
			
			return reply.code(204).send({message: "SUCCESS"});
		}
		catch (error)
		{
			return reply.code(500).send({error: error.message});
		}
	}
	
	deleteUser(request, reply)
	{
		try {
			const db = request.server.db;
			if (request.user.userId !== parseInt(request.params.id))
				return reply.code(403).send({error: "FORBIDDEN"});
			const user = db.prepare('SELECT * From users WHERE id = ?').get(request.params.id);
			if (!user)
				return reply.code(404).send({error: "USER_NOT_FOUND"});
			const deleted = db.prepare('DELETE FROM users WHERE id = ?').run(request.params.id);
			
			return reply.code(204).send({message: "SUCCESS"});
		}
		catch (error)
		{
			return reply.code(500).send({error: error.message});
		}
		
	}
	
	searchUsers(request, reply){
		try{
			const db = request.server.db;
			const { query } = request.query;
	
			console.log(query);
			if (!query || typeof query !== 'string'){
				return reply.code(400).json({ error: 'QUERY_PARAMETER_REQUERED' });
			}
	
			const searchUser = query.trim();
	
			if (trimmedQuery.length < 2) {
				return reply.code(400).json({ error: 'QUERY_TOO_SHORT' });
			}
	
			if (trimmedQuery.length > 20) {
		  return reply.code(400).json({ error: 'QUERY_TOO_LONG' });
		}
	
			const searchPattern = `%${searchUser}%`;
			const startsWithPattern = `${searchUser}%`;
	
			// add AND id != the userId later 
			const statement = db.prepare(`
	
				SELECT id, firstname, lastname, username, email, avatar
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
			avatar: user.avatar,
			fullName: `${user.firstname} ${user.lastname}`
			}));
	
			return reply.code(200).send(formattedResults);
		}
		catch(error) {
			return reply.code(500).send({ error: error.message })
		}
	
	}
}


export const userController = new UserController();