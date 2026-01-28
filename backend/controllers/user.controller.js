import bcrypt from "bcrypt"
import path from "path";
import { pipeline } from 'stream/promises';
import fs from "fs"

import { userModels } from "../models/user.model.js";
import { generateFileNameByUser } from "../utils/authUtils.js";
import { updateUserSchema, zErrorHandler } from "../utils/inputValidator.js"

/**
 * still neeed to apply erroring system
*/

async function fileUpload(user, file)
{
	const uploadDir = path.join(process.cwd(), 'uploads');
	const image = file.fileStream;
	const filename = generateFileNameByUser(user.username, file.filename, file.mimetype);
	const filePath = path.join(uploadDir, filename);
	console.log("MDR");
	await pipeline(image, fs.createWriteStream(filePath));
	console.log("LOL");
	const fileLink = `${process.env.API_URL}/uploads/${filename}`;
	console.log(fileLink);
	return (fileLink);
}

export class UserController 
{
	getAllUsers(request, reply)
	{
		try {
			const db = request.server.db;
			const users = userModels.getAllUsers(db);
			return reply.code(200).send({message: "SUCCESS", userData: users});
		}
		catch (error) {
			if (error.code)
				return reply.code(error.code).send({error: error.message});
			else
				return reply.code(500).send({error: error.message});
        }
	}
	
	getOneUser(request, reply)
	{
		try {
			const db = request.server.db;
			const user = userModels.getUserById(db, request.params.id);
			if (!user)
				return reply.code(404).send({error: "USER_NOT_FOUND"});
			return reply.code(200).send({message: "SUCCESS", userData: user});
		}
		catch (error) {
			if (error.code)
				return reply.code(error.code).send({error: error.message});
			else
				return reply.code(500).send({error: error.message});
        }
	}


	
	async  updateUser(request, reply)
	{
		try {
			const db = request.server.db;
			let userData = {};
			let fileInfo = {};

			if (request.user.userId !== parseInt(request.params.id))
				return reply.code(403).send({error: "FORBIDDEN"});
			for await (const part of request.parts())
			{
				if (part.type === "field")
					userData[part.fieldname] = part.value;
				else if (part.type === "file")
				{
					fileInfo = {
						filename: part.filename,
						encoding: part.encoding,
						mimetype: part.mimetype,
						fileStream: part.file
					}
					userData["avatar"] = await fileUpload(request.user, fileInfo);
				}
			}
			const validatedData = updateUserSchema.parse(userData);
			const user = userModels.getUserById(db, request.params.id);
			if (!user)
				return reply.code(404).send({error: "USER_NOT_FOUND"});

			userData = {
				firstname: validatedData.firstname || user.firstname,
				lastname: validatedData.lastname || user.lastname,
				username: validatedData.username || user.username,
				email: validatedData.email || user.email,
				avatar: validatedData.avatar || user.avatar
			}
			
			userModels.updateUserById(db, request.params.id, userData);
			
			return reply.code(201).send({message: "SUCCESS", user:userData});
		}
		catch (error) {
			const zError = zErrorHandler(error);
			console.log(zError.fields);
			if (zError !== null)
				return reply.code(zError.code).send({error: zError.error, fields: zError.fields});
			if (error.code)
				return reply.code(error.code).send({error: error.message});
			else
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
		catch (error) {
			if (error.code)
				return reply.code(error.code).send({error: error.message});
			else
				return reply.code(500).send({error: error.message});
        }
		
	}
	
	async changePassword(request, reply)
	{
		const db = request.server.db;

		try
		{
			const { oldPassword, newPassword, repeatNewPassword} = request.body;
			if (newPassword !== repeatNewPassword)
				return reply.code(400).send({error: 'NEW_PASSWORDS_DO_NOT_MATCH'});
			if (newPassword === oldPassword)
				return reply.code(400).send({error: 'NEW_PASSWORD_MATCHS_OLD_PASSWORD'});

			const userPassword = userModels.getPassword(db, request.user.userId);
			const match = await bcrypt.compare(oldPassword, userPassword);
			if (!match)
				return reply.code(401).send({ error: 'CURRENT_PASSWORD_IS_INCORRECT' });
			await userModels.setNewPassword(db, request.user.userId, newPassword);
			return reply.code(200).send({message: "PASSWORD_CHANGED_SUCCESSFULLY"});
		}
		catch (error) {
			if (error.code)
				return reply.code(error.code).send({error: error.message});
			else
				return reply.code(500).send({error: error.message});
        }
	}

	searchUsers(request, reply)
	{
		const db = request.server.db;
		try
		{
			const { q, page } = request.query;
			const pageNum = Math.max(1, Number(page));
        	const limit = 10;
			const offset = (pageNum - 1) * limit;
			const query = q.trim();
			if (!query || query.length < 2 || query.length > 20)
				return reply.code(400).send({ error: 'INVALID_QUERY' });
			const results = userModels.searchUsers(db, q, limit, offset);
			console.log(results);
			return reply.code(200).send({message: "SUCCESS", page: pageNum, limit: limit, users: results});
		}
		catch (error) {
			if (error.code)
				return reply.code(error.code).send({error: error.message});
			else
				return reply.code(500).send({error: error.message});
        }
	
	}
}


export const userController = new UserController();