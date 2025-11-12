import { getUsers, getUser } from "../controllers/user.controller.js";
import { authorization } from "../middlewares/authorization.js";

export default async function userRoutes(fastify){
    fastify.route({
        method: "GET",
        url: "/users",
        handler: getUsers
    })

    fastify.route({
        method:"GET",
        url:"/user/profile",
        // preHandler: authorization,
        handler: getUser
    })
}