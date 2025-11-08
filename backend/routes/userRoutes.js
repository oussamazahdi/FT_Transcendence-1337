import { getAllUsers, getOneUser, updateUser, deleteUser } from "../controllers/userController";

function userRoutes(fastify)
{
    fastify.get("/", getAllUsers);
    fastify.get("/:id", getOneUser);
    fastify.put("/:id", updateUser);
    fastify.delete("/:id", deleteUser);
}

export { userRoutes };