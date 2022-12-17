// Server
require('dotenv').config();
const express = require('express');
const https = require('https')
const fs = require('fs')
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const appPort = process.env.APP_PORT || 3000;

// App Services
const { passport } = require('./app/passport.js');
const createSearchService = require('./app/search.js');

// GraphQL
const { installHandler } = require('./graphql/api_handler.js');
const { graphqlUploadExpress } = require('graphql-upload');

// Routes
const { defineHomeRoutes } = require('./routes/home.js');
const { defineLessonRoutes } = require('./routes/lessons.js');
const { defineAccountProfileRoutes } = require('./routes/accountProfile.js');
const { defineVideoRoutes } = require('./routes/videos.js');
const { defineLikeRoutes } = require('./routes/likes.js');
const { defineVideoChatRoutes } = require('./routes/videoChat.js');
const { defineAuthenticationRoutes } = require('./routes/authentication.js');
const { defineUserRoutes } = require('./routes/users.js');
const { defineStripeRoutes } = require('./routes/stripe.js');

// Configure Server
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', '.jsx');
app.engine('jsx', require('express-react-views').createEngine());

// For login sessions
app.use(session({
	secret: 'supersecret',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


(async function start(){
	try{

		// Install GraphQL API Handler
		app.route('/graphql').post(graphqlUploadExpress());
		await installHandler(app);


		// Home route
		defineHomeRoutes(app);

		// Lessons routes
		defineLessonRoutes(app);

		// Video routes
		const VideoSearchService = await createSearchService('videos', ['title', 'languageOfTopic']);
		defineVideoRoutes(app);

		// Like routes
		defineLikeRoutes(app);

		// Account Profile routes
		defineAccountProfileRoutes(app);

		// Video Chat routes
		defineVideoChatRoutes(app);

		// Authentication routes
		defineAuthenticationRoutes(app);

		// User routes
		defineUserRoutes(app);

		// Stripe routes
		defineStripeRoutes(app);

		const httpsOptions = {
			key: fs.readFileSync('./security/cert.key'),
			cert: fs.readFileSync('./security/cert.pem')
		}

		// Start app
		if(appPort == 443){
			https.createServer(httpsOptions, app)
				.listen(appPort, () => {
					console.log(`App up on port ${appPort}`);
				});
		} else {
			app.listen(appPort, () => {
				console.log(`App up on port ${appPort}`);
			});
		}

	} catch(err){
		console.log(`Error: ${err}`);
	}
})();
