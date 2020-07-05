const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://127.0.0.1:27017';

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', '.jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('home');
});

// app.get('/about', (req, res) => {
// 	res.render('about', {mongoClient, mongoURL});
// });

app.listen(port, () => {
	if(port === 3000){
		console.log('App up on http://localhost:3000');
	}
});

// MongoDB
mongoClient.connect(mongoURL, {useNewUrlParse: true})
	.then((client) => {

		db = client.db('test');
		console.log('Connected');

		collection = db.collection('fun');
		collection.find().toArray(function(err, items){
			console.log(items)
			app.get('/about', (req, res) => {
				res.render('about', {items});
			});
		});
	})