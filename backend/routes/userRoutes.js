import { getAllUsers, getOneUser, updateUser, deleteUser, searchUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

function userRoutes(fastify)
{
    fastify.get("/", {preHandler: authMiddleware}, getAllUsers);
    fastify.get("/:id", {preHandler: authMiddleware}, getOneUser);
    fastify.put("/:id", {preHandler: authMiddleware}, updateUser);
    fastify.delete("/:id", {preHandler: authMiddleware}, deleteUser);
    fastify.get("/search", {preHandler: authMiddleware}, searchUsers);
}

export { userRoutes };