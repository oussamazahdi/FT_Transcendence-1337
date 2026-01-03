// needs more understanding
export const corsConfig = {
				origin: ['http://localhost:3000'],
				methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
				allowedHeaders: ['Content-Type','Authorization'],
				credentials: true,
				maxAge: 600
};