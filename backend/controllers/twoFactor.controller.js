


// export class twoFactorController
// {
//     async  setup(request, reply)
//     {
//         const db = request.server.db;

//         try {
//             const secret = fastify.totp.generateSecret()
//             const email = authModels.getUserEmail(db, request.user.userId);

//             const qrcode = await fastify.totp.generateQRCode({ 
//                 secret: secret.ascii,
//                 issuer: 'ft_transcendence',
//                 label: email
//             })

//         }
//         catch (error)
//         {
//             if (error.code)
//                 return reply.code(error.code).send({error: error.message});
//             return reply.code(500).send(error.message);
//         }
//     }
// }