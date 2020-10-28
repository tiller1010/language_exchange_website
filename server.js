const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'public/assets/' });
const path = require('path');
const port = process.env.PORT || 3000;
const { connectToDB, getDB } = require('./db.js');
const { index, add } = require('./videos.js');
const feathers = require('@feathersjs/feathers');
const service = require('feathers-mongodb');
const search = require('feathers-mongodb-fuzzy-search');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', '.jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


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

		// Index videos route
		app.get('/videos:format?', async (req, res) => {
			let keywords = req.query.keywords || false;
			let videos = null;
			// If using search keywords
			if(keywords){
			    videos = await VideoService.find({ query: { $search: keywords } })
			} else {
				videos = await index();
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
		app.post('/videos/add', upload.single('video'), async (req, res) => {
			await add({
				title: req.body.title,
				src: 'assets/' + req.file.filename,
				originalName: req.file.originalname
			});
			res.redirect('/videos');
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