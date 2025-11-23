import { getAllUsers, getOneUser, updateUser, deleteUser, searchUsers } from "../controllers/userController.js";

function userRoutes(fastify)
{
    fastify.get("/", getAllUsers);
    fastify.get("/:id", getOneUser);
    fastify.put("/:id", updateUser);
    fastify.delete("/:id", deleteUser);
    
    //added by soufiix
    fastify.get("/search", searchUsers);
}

export { userRoutes };