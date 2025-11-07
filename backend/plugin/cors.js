import fp from 'fastify-plugin'
import cors from '@fastify/cors'

async function corsPlugin(fastify){
    await fastify.register(cors, {
        origin: ['http://localhost:3001'],
        methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization'],
        credentials: true,
        maxAge: 600// kamal must explain this to me 
    })
}

export default fp(corsPlugin);