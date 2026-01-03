import googleOAuth2 from '@fastify/oauth2';

export const oauth2Config = {
		name: 'googleOAuth2',
		credentials: {
				client: {
						id: process.env.GOOGLE_CLIENT_ID,
						secret: process.env.GOOGLE_CLIENT_SECRET
				},
				auth: googleOAuth2.GOOGLE_CONFIGURATION
		},
		startRedirectPath: '/api/oauth/google',
		callbackUri: "http://localhost:3001/api/oauth/google/callback",
		scope: ['profile', 'email'],
};
