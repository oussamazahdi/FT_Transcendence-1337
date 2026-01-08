import { authMiddleware } from "../middlewares/authMiddleware.js";
import { friendsController } from "../controllers/friends.controller.js"
import fastify from "fastify";

function friendsRoutes(fastify)
{
    fastify.get("/", friendsController.getAllFriends);
    fastify.get("/requests", friendsController.getAllFriendRequests);
    fastify.post("/requests/:id", friendsController.sendFriendRequest);
    fastify.post("/requests/:id/accept", friendsController.acceptFriendRequest);
    fastify.get("/blocks", friendsController.getAllBlocked);
    fastify.post("/blocks/:id", friendsController.block);
    // fastify.delete("/blocks/:id", friendsController.unblock);
    // fastify.delete("/:id", friendsController.unfriend);
    // fastify.delete("/requests/:id", friendsController.cancelFriendRequest);

}

export { friendsRoutes };