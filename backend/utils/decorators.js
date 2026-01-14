import { createDatabase } from '../config/database.config.js';
import { createEmailTransporter } from '../config/email.config.js';

export function registerDecorators(fastify) {
    const db = createDatabase();
    fastify.decorate('db', db);
    
    const transporter = createEmailTransporter();
    fastify.decorate('nodemailer', transporter);
}