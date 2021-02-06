const express = require('express');
const multer  = require('multer');
var upload = multer({ dest: 'public/assets/' });
const path = require('path');
const port = process.env.PORT || 3000;
const { connectToDB, getDB } = require('./db.js');
const { index, add, getRecent } = require('./videos.js');
const feathers = require('@feathersjs/feathers');
const service = require('feathers-mongodb');
const search = require('feathers-mongodb-fuzzy-search');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', '.jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

function randomFilename() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 40; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/public/assets');
	},
	filename: function(req, file, cb){
		let fileExtension = file.mimetype.split('').splice(file.mimetype.indexOf('/') + 1, file.mimetype.length).join('');
		if(fileExtension == 'quicktime'){
			fileExtension = 'mov';
		}
		cb(null, randomFilename() + '.' + fileExtension);
	}
})
 
var upload = multer({ storage });

(async function start(){
	try{
		await connectToDB();
		const db = await getDB();

		// Create search service
		const feathersService = feathers();
		// Use videos for search
		feathersService.use('/videos', service({
			Model: db.collection('videos'),
			whitelist: ['$text', '$search']
		}));
		// Create video search service
		const VideoService = feathersService.service('videos');
		// Create videos index
		VideoService.Model.createIndex({ title: 'text' })
		// Add search hooks
		VideoService.hooks({
			before: {
			  find: search()
			}
		})

		// Home route
		app.get('/', (req, res) => {
			res.render('home');
		});

		app.get('/recent-videos', async (req, res) => {
			const videos = await getRecent();
			res.send(JSON.stringify(videos));
		});

		// Levels route
		app.get('/level/:levelID', (req, res) => {
			res.render('level.jsx', {levelID: req.params.levelID});
		});

		// Topics route
		app.get('/level/:levelID/topics/:topicID', (req, res) => {
			res.render('topic.jsx', {
				levelID: req.params.levelID,
				topicID: req.params.topicID
			});
		});

		// Index videos route
		app.get('/videos:format?', async (req, res) => {
			let keywords = req.query.keywords || false;
			let videos = null;
			const page = req.query.page || 1;
			// If using search keywords
			if(keywords){
				const searchPageLength = 3;
				videos = await VideoService.find({
					query: {
						$search: keywords,
						$limit: searchPageLength,
						$skip: (page - 1) * searchPageLength
					}
				});
				const allVideoResults = await VideoService.find({ query: { $search: keywords } });
				const pages = Math.ceil(allVideoResults.length / searchPageLength);

			    videos = {
			    	videos,
			    	pages
			    }
			} else {
				videos = await index(page);
			}
			if(req.params.format){
				res.format({
					json: function(){
						res.send(JSON.stringify(videos))
					}
				})
			}
			res.render('videos');
		});

		app.get('/videos/add', (req, res) => {
			res.render('videos-add');
		});

		// Add video route
		app.post('/videos/add', upload.fields([{name: 'video', maxCount: 1}, {name: 'thumbnail', maxCount: 1}]), async (req, res) => {
			await add({
				title: req.body.title,
				src: 'assets/' + req.files['video'][0].filename,
				originalName: req.files['video'][0].originalname,
				thumbnailSrc: 'assets/' + req.files['thumbnail'][0].filename,
				originalThumbnailName: req.files['thumbnail'][0].originalname,
				created: new Date()
			});
			if(req.body.nativeFlag){
				res.status(200).send('Successful upload');
			} else {
				res.redirect('/videos');
			}
		});

		// Start app
		app.listen(port, () => {
			if(port === 3000){
				console.log('App up on http://localhost:3000');
			}
		});
	} catch(err){
		console.log(`Error: ${err}`);
	}
})();