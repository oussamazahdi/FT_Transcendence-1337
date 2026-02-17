export const corsConfig = {
        origin: [process.env.FRONTEND_URL,`http://localhost:${process.env.FRONTEND_PORT}`],
        methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization'],
        credentials: true,
        maxAge: 600
};