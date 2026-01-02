import { authMiddleware } from "../middlewares/authMiddleware.js";
import { friendsController } from "../controllers/friends.controller.js"
import fastify from "fastify";

function friendsRoutes(fastify)
{
    // friends
    // fastify.get("/", friendsController.getAllFriends);
    // fastify.delete("/:id", friendsController.unfriend);
    // // requests
    // fastify.post("/requests/:id", friendsController.sendFriendRequest);
    // fastify.delete("/requests/:id", friendsController.cancelFriendRequest);
    // fastify.post("/requests/:id/accept", friendsController.acceptFriendRequest);
    // fastify.get("/requests", friendsController.getAllFriendRequests);
    // //blockes
    // fastify.get("/blocks", friendsController.getAllBlocked);
    // fastify.delete("/blocks/:id", friendsController.unblock);
    // fastify.post("/blocks/:id", friendsController.block);

}

export { friendsRoutes };