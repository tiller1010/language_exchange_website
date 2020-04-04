const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const expressHandlebars = require('express-handlebars');

var app = express();
var hbs = expressHandlebars({
	extname: '.hbs',
	defaultLayout: false
});

app.engine('.hbs', hbs);
app.set('view engine', '.hbs');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('home');
});

app.listen(port, () => {
	if(port === 3000){
		console.log('App up on http://localhost:3000');
	}
});