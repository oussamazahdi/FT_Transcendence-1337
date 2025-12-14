
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

function userRoutes(fastify)
{
    fastify.get("/", {preHandler: authMiddleware}, userController.getAllUsers);
    fastify.get("/:id", {preHandler: authMiddleware}, userController.getOneUser);
    fastify.put("/:id", {preHandler: authMiddleware}, userController.updateUser);
    fastify.delete("/:id", {preHandler: authMiddleware}, userController.deleteUser);
    fastify.get("/search", {preHandler: authMiddleware}, userController.searchUsers);
}

export { userRoutes };