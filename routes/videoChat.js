const { myCipher } = require('../app/cipher.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

const isLive = process.env.APP_ENV == 'production';

module.exports.defineVideoChatRoutes = function(app) {

	// Chats route
	app.get('/chats', (req, res) => {
		let userID = null;
		if(req.user){
			userID = req.user._id;
		}
		const props = { userID };
		if (isLive) {
			return res.render('chats', { p: myCipher(JSON.stringify(props)), isLive });
		} else {
			res.render('chats', props);
		}
	});

	app.get('/video-chat', async (req, res) => {
		let userID = null;
		if(req.user){
			userID = req.user._id;
		}
		const props = { authenticatedUserID: userID };
		if (isLive) {
			return res.render('video-chat', { p: myCipher(JSON.stringify(props)), isLive });
		} else {
			return res.render('video-chat', props);
		}
	});
	app.post('/video-chat-tokens', async (req, res) => {
		const firebaseConfig = {
			projectId: process.env.FIREBASE_PROJECT_ID,
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost',
		};
		return res.json(firebaseConfig);
	});
}