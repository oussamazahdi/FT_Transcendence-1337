export const swaggerConfig = {
    openapi: {
        info: {
            title: 'ft_transcendence API',
            description: 'Authentication & User Management API',
            version: '1.0.0'
        },
        servers: [
            { url: process.env.API_URL, description: 'Development' }
        ]
    }
};

export const swaggerUiConfig = {
    routePrefix: '/docs',
    theme: {
        title: 'ft_transcendence API Docs'
    },
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    }
};