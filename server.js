const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const { connectToDB } = require('./db.js');
const { index, add } = require('./videos.js');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', '.jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

(async function start(){
	try{
		await connectToDB();

		app.get('/', (req, res) => {
			res.render('home');
		});

		app.get('/videos:format?', async (req, res) => {
			let videos = await index();
			if(req.params.format){
				res.format({
					json: function(){
						res.send(JSON.stringify(videos))
					}
				})
			}
			res.render('videos', {videos});
		});

		app.get('/videos/add', (req, res) => {
			res.render('videos-add');
		});

		app.post('/videos/add', async (req, res) => {
			console.log(req.body)
			await add({title: req.body.title});
			res.redirect('/videos');
		});

		app.listen(port, () => {
			if(port === 3000){
				console.log('App up on http://localhost:3000');
			}
		});
	} catch(err){
		console.log(`Error: ${err}`);
	}
})();