// export const serverConfig = {
// 		logger: false
// };
export const serverConfig = {
		logger: {
				transport: {
						target: 'pino-pretty',
						options: {
								colorize: true,
								translateTime: 'yyyy-mm-dd HH:MM:ss',
								ignore: 'pid,hostname',
						}
				}
		}
};