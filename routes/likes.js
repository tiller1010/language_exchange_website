const { addLike, removeLike } = require('../database/methods/likes.js');

module.exports.defineLikeRoutes = function(app) {

	// React Native Send like API
	app.post('/sendLike/:videoID', async (req, res) => {
		if ((new RegExp(req.ip)).test(process.env.REACT_NATIVE_APP_URL)) {
			res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_APP_URL);
		} else if ((new RegExp(req.hostname)).test(process.env.REACT_NATIVE_WEB_APP_URL)) {
			res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_WEB_APP_URL);
		}
		// Only can send a like if logged in
		if(!req.body.user){
			return res.send({ message: 'Must be signed in to send like.' });
		} else {
			const updatedVideo = await addLike(req.body.user._id, req.params.videoID);
			return res.send(updatedVideo);
		}
	});

	// React Native Remove like API
	app.post('/removeLike/:videoID', async (req, res) => {
		if ((new RegExp(req.ip)).test(process.env.REACT_NATIVE_APP_URL)) {
			res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_APP_URL);
		} else if ((new RegExp(req.hostname)).test(process.env.REACT_NATIVE_WEB_APP_URL)) {
			res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_WEB_APP_URL);
		}
		// Only can remove a like if logged in
		if(!req.body.user){
			return res.send({ message: 'Must be signed in to remove like.' }); // This cannot occur in most cases. Need to be signed in to send likes.
		} else {
			const updatedVideo = await removeLike(req.body.user._id, req.params.videoID);
			return res.send(updatedVideo);
		}
	});
}