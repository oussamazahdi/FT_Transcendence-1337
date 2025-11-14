import { getAllUsers, getOneUser, updateUser, deleteUser } from "../controllers/userController.js";

function userRoutes(fastify)
{
    fastify.get("/", getAllUsers);
    fastify.get("/:id", getOneUser);
    fastify.put("/:id", updateUser);
    fastify.delete("/:id", deleteUser);
}

export { userRoutes };