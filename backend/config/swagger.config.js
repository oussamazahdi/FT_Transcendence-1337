export const swaggerConfig = {
    openapi: {
        info: {
            title: 'ft_transcendence API',
            description: 'Authentication & User Management API',
            version: '1.0.0'
        },
        servers: [
            { url: 'http://localhost:3001', description: 'Development' }
        ]
    }
};

export const swaggerUiConfig = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    }
};