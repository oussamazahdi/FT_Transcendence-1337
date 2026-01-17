import app from './app.js';

const PORT = process.env.BACKEND_PORT;

const start = async () => {
    try {
        await app.listen({ port: PORT});
        console.log(process.env.GOOGLE_CLIENT_SECRET);
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Docs available at http://localhost:${PORT}/docs`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();