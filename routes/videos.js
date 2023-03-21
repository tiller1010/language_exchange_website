const {
	indexVideos,
	findVideo,
	addVideo,
	updateVideo,
	removeVideo,
	getRecent,
	addVideoToUsersUploads,
} = require('../database/methods/videos.js');
const upload = require('../app/upload.js')();
const { myCipher } = require('../app/cipher.js');

const isLive = process.env.APP_ENV == 'production';

module.exports.defineVideoRoutes = function(app, VideoSearchService) {

	// Recent videos API
	app.get('/recent-videos', async (req, res) => {
		const videos = await getRecent();
		if ((new RegExp(req.ip)).test(process.env.REACT_NATIVE_APP_URL)) {
			res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_APP_URL);
		} else if ((new RegExp(req.hostname)).test(process.env.REACT_NATIVE_WEB_APP_URL)) {
			res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_WEB_APP_URL);
		}
		res.send(JSON.stringify(videos));
	});


	// Index videos route
	app.get('/videos:format?', async (req, res) => {
		let keywords = req.query.keywords || '';
		keywords = keywords.replace(/\s$/, '');
		let languageOfTopic = req.query.languageOfTopic || '';
		let sort = req.query.sort || 'Recent';
		let videos = null;
		const page = req.query.page || 1;

		// If using sort
		let sortObject = {};
		if(sort === 'Recent'){
			sortObject = {created: -1};
		} else if(sort === 'Oldest'){
			sortObject = {created: 1};
		} else if(sort === 'A-Z'){
			sortObject = {title: 1};
		} else if(sort === 'Z-A'){
			sortObject = {title: -1};
		}
		// If using search keywords
		if(keywords || languageOfTopic){
			const searchPageLength = 3;
			videos = await VideoSearchService.find({
				query: {
					title: { $search: keywords },
					languageOfTopic: { $search: languageOfTopic },
					$sort: sortObject,
					$limit: searchPageLength,
					$skip: (page - 1) * searchPageLength
				}
			});
			const allVideoResults = await VideoSearchService.find({ query: { title: { $search: keywords }, languageOfTopic: { $search: languageOfTopic } } });
			const pages = Math.ceil(allVideoResults.length / searchPageLength);

		    videos = {
		    	videos,
		    	pages
		    }
		} else {
			videos = await indexVideos(page, sortObject);
		}

		if(req.params.format){
			res.format({
				json: function(){
					if ((new RegExp(req.ip)).test(process.env.REACT_NATIVE_APP_URL)) {
						res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_APP_URL);
					} else if ((new RegExp(req.hostname)).test(process.env.REACT_NATIVE_WEB_APP_URL)) {
						res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_WEB_APP_URL);
					}
					res.send(JSON.stringify(videos))
				}
			})
			return;
		}

		let userLikedVideos = [];
		let userID = null;
		if(req.user){
			userLikedVideos = req.user.likedVideos || [];
			userID = req.user._id;
		}
		const props = { userLikedVideos, userID, videos: videos.videos };
		if (isLive) {
			return res.render('videos', { p: myCipher(JSON.stringify(props)), isLive, videos: props.videos });
		} else {
			res.render('videos', props);
		}
	});

	// Add video route
	app.get('/videos/add', (req, res) => {
		res.render('videos-add');
	});

	// Submit new video route
	app.post('/videos/add', upload.fields([
		{name: 'video', maxCount: 1},
		{name: 'thumbnail', maxCount: 1},
		{name: 'soundRecording', maxCount: 1},
	]), async (req, res) => {

		let src = 'assets/';
		let originalName = '';
		if (req.body.useSoundRecording) {
			src += req.files['soundRecording'][0].filename;
			originalName = 'soundrecording.webm';
		} else {
			src += req.files['video'][0].filename;
			originalName = req.files['video'][0].originalname;
		}

		const newVideo = await addVideo({
			title: req.body.title,
			languageOfTopic: req.body.languageOfTopic,
			src,
			originalName,
			thumbnailSrc: req.files.thumbnail ? 'assets/' + req.files.thumbnail[0].filename : '',
			originalThumbnailName: req.files.thumbnail ? req.files.thumbnail[0].originalname : '',
			created: new Date(),
			uploadedBy: req.user ? { _id: req.user._id, displayName: req.user.displayName } : { displayName: 'Guest' }
		});
		let redirectTo = '/videos';
		if(req.user){
			redirectTo = '/account-profile';
			await addVideoToUsersUploads(newVideo, req.user._id);
		}
		if(req.body.nativeFlag){
			res.status(200).send('Successful upload');
		} else {
			res.redirect(redirectTo);
		}
	});

	// Edit video route
	app.get('/videos/edit/:videoID', async (req, res) => {
		const video = await findVideo(req.params.videoID);
		res.render('videos-add', { video: JSON.stringify(video), pathResolver: '../../' });
	});

	// Submit update video route
	app.post('/videos/edit/:videoID', upload.fields([
		{name: 'video', maxCount: 1},
		{name: 'thumbnail', maxCount: 1},
		{name: 'soundRecording', maxCount: 1},
	]), async (req, res) => {

		const video = await findVideo(req.params.videoID);

		let updatedVideo = {
			videoID: req.params.videoID,
			title: req.body.title,
			languageOfTopic: req.body.languageOfTopic,
		};

		if (req.body.useSoundRecording) {
			updatedVideo.src = 'assets/' + req.files['soundRecording'][0].filename;
			updatedVideo.originalName = 'soundrecording.webm';
		} else if (req.files['video']) {
			updatedVideo.src = 'assets/' + req.files['video'][0].filename;
			updatedVideo.originalName = req.files['video'][0].originalname;
		}

		if (req.files['thumbnail']) {
			updatedVideo.thumbnailSrc = 'assets/' + req.files['thumbnail'][0].filename;
			updatedVideo.originalThumbnailName = req.files['thumbnail'][0].originalname;
		}

		if (req.user) {
			if (String(req.user._id) == String(video.uploadedBy._id) || req.user.isAdmin) {
				await updateVideo(updatedVideo);
			}
		}

		if(req.body.nativeFlag){
			res.status(200).send('Successful upload');
		} else {
			res.redirect('/account-profile');
		}
	});

	// Remove uploaded video route
	app.post('/videos/remove', async (req, res) => {
		if(req.user){
			await removeVideo(req.body.videoID);
		}
		if(req.body.nativeFlag){
			res.status(200).send('Successfully removed');
		} else {
			res.redirect('/account-profile');
		}
	});
}
