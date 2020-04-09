const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

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