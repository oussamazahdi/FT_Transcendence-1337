import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

export default async function authRoutes(fastify) {
    fastify.route({
        method: "POST",
        url: "/sign-up",
        handler: signUp
    })

    fastify.route({
        method: "POST",
        url: "/sign-in",
        handler: signIn
    })

    fastify.route({
        method: "POST",
        url: "/sign-out",
        handler: signOut
    })
}