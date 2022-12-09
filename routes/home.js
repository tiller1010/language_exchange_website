const { myCipher } = require('../app/cipher.js');

module.exports.defineHomeRoutes = function(app) {
	app.get('/', (req, res) => {
		let userLikedVideos = [];
		let userID = null;
		if(req.user){
			userLikedVideos = req.user.likedVideos || [];
			userID = req.user._id;
		}
		const isLive = process.env.APP_ENV == 'production';
		if (isLive) {
			res.render('home', { p: myCipher(JSON.stringify({ userLikedVideos, userID })), isLive });
		} else {
			res.render('home', { userLikedVideos, userID, isLive });
		}
	});
}