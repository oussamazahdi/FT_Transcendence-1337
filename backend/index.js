import app from './app.js';

const PORT = process.env.PORT || 3001;

const start = async () => {
    try {
        await app.listen({ port: PORT });
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 Docs available at http://localhost:${PORT}/docs`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();