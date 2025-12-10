import fp from 'fastify-plugin'
import cors from '@fastify/cors'

async function corsPlugin(fastify){
    await fastify.register(cors, {
        origin: ['*'],
        methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization'],
        credentials: true,
        maxAge: 600
    })
}

export default fp(corsPlugin);