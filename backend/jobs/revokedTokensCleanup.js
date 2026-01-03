import cron from 'node-cron';

function setupTokenCleanup(db) {
		
		cron.schedule('0 3 * * *', () => {
				const now = new Date().toISOString();
				
				const tokensResult = db.prepare(`
						DELETE FROM tokens 
						WHERE creationdate < datetime('now', '-7 days')
				`).run();
				
				const blacklistResult = db.prepare(`
						DELETE FROM revoked_tokens 
						WHERE expirationdate < ?
				`).run(now);
				
		});
		
		console.log(' Token cleanup done');
}

export { setupTokenCleanup };