// Server
require('dotenv').config();
const express = require('express');
const https = require('https')
const fs = require('fs')
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const appPort = process.env.APP_PORT || 3000;

// Database Methods
const { addLike, removeLike } = require('./database/methods/likes.js');
const { addUser, findAndSyncUser, findUserByID, addCompletedTopic, removeCompletedTopic, addStripeAccountIDToUser } = require('./database/methods/users.js');
const { indexVideos, addVideo, removeVideo, getRecent, addVideoToUsersUploads } = require('./database/methods/videos.js');
const { completeOrder } = require('./database/methods/products.js');

// Strapi Methods
const { getTopic, getTopicChallenges } = require('./strapi/topics.js');

// App Services
const { passport } = require('./app/passport.js');
const bcrypt = require('bcrypt');
const firebase = require('./app/firebase');
const createSearchService = require('./app/search.js');
const upload = require('./app/upload.js')();
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

// GraphQL
const { installHandler } = require('./graphql/api_handler.js');
const { graphqlUploadExpress } = require('graphql-upload');

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

		const VideoSearchService = await createSearchService('videos', ['title']);

		// Home route
		app.get('/', (req, res) => {
			let userLikedVideos = [];
			let userID = null;
			if(req.user){
				userLikedVideos = req.user.likedVideos || [];
				userID = req.user._id;
			}
			res.render('home', { userLikedVideos, userID });
		});

		// Recent videos API
		app.get('/recent-videos', async (req, res) => {
			const videos = await getRecent();
			res.send(JSON.stringify(videos));
		});

		// Levels route
		app.get('/level/:levelID', (req, res) => {
			res.render('level.jsx', {levelID: req.params.levelID});
		});

		// Topics route
		app.get('/level/:levelID/topic/:topicID', (req, res) => {
			let completed = false;
			if(req.user){
				let completedTopics = req.user.completedTopics || [];
				completedTopics.forEach((topic) => {
					if(topic.id == req.params.topicID){
						completed = true;
					}
				});
			}
			res.render('topic.jsx', {
				levelID: req.params.levelID,
				topicID: req.params.topicID,
				completed
			});
		});
		app.post('/level/:levelID/topic/:topicID', async (req, res) => {
			if(req.user && req.params.levelID && req.params.topicID){
				const topicData = await getTopic(req.params.topicID);
				const challenges = await getTopicChallenges(req.params.topicID);
				const topic = {
					levelID: req.params.levelID,
					topicID: req.params.topicID,
					...topicData,
					challenges
				}
				addCompletedTopic(req.user._id, topic);
				res.send('success');
			}
		});
		app.post('/level/:levelID/topic/:topicID/reset', async (req, res) => {
			if(req.user && req.params.topicID){
				removeCompletedTopic(req.user._id, req.params.topicID);
				res.send('reset');
			}
		});


		// Index videos route
		app.get('/videos:format?', async (req, res) => {
			let keywords = req.query.keywords || false;
			let sort = req.query.sort || false;
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
			if(keywords){
				const searchPageLength = 3;
				videos = await VideoSearchService.find({
					query: {
						title: { $search: keywords },
						$sort: sortObject,
						$limit: searchPageLength,
						$skip: (page - 1) * searchPageLength
					}
				});
				const allVideoResults = await VideoSearchService.find({ query: { title: { $search: keywords } } });
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

			res.render('videos', { userLikedVideos, userID });
		});

		// React Native Send like API
		app.post('/sendLike/:videoID', async (req, res) => {
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
			// Only can remove a like if logged in
			if(!req.body.user){
				return res.send({ message: 'Must be signed in to remove like.' }); // This cannot occur in most cases. Need to be signed in to send likes.
			} else {
				const updatedVideo = await removeLike(req.body.user._id, req.params.videoID);
				return res.send(updatedVideo);
			}
		});

		// Add video route
		app.get('/videos/add', (req, res) => {
			res.render('videos-add');
		});

		// Submit new video route
		app.post('/videos/add', upload.fields([{name: 'video', maxCount: 1}, {name: 'thumbnail', maxCount: 1}]), async (req, res) => {
			const newVideo = await addVideo({
				title: req.body.title,
				src: 'assets/' + req.files['video'][0].filename,
				originalName: req.files['video'][0].originalname,
				thumbnailSrc: 'assets/' + req.files['thumbnail'][0].filename,
				originalThumbnailName: req.files['thumbnail'][0].originalname,
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

		// Account profile
		app.get('/account-profile/:viewOtherUserID?',
			async (req, res) => {
				if(req.params.viewOtherUserID){
					let user = await findAndSyncUser(req.params.viewOtherUserID, 'id');
					let isCurrentUser = req.user ? String(req.user._id) == String(user._id) : false;
					return res.render('account-profile', {
						userID: user._id,
						authenticatedUserID: req.user ? req.user._id : null,
						isCurrentUser,
						pathResolver: '../',
					});
				}else if(req.user){
					let user = req.user;
					return res.render('account-profile', {
						userID: user._id,
						authenticatedUserID: req.user._id,
						isCurrentUser: true,
					});
				} else {
					return res.redirect('/login');
				}
			}
		);

		// Account login
		app.get('/login', (req, res) => {
			if(req.user){
				return res.redirect('/account-profile');
			}
			const errors = req.flash().error || [];
			res.render('login', { errors });
		});
		// Submit login form
		app.post('/login', async (req, res) => {
			// Set JWT cookie to stay signed in
			const { displayName, password } = req.body;
			if((displayName && password) && !req.cookies.jwt){
				const user = await findAndSyncUser(displayName, 'local');
				if(user && bcrypt.compareSync(password, user.passwordHash)){
					const { JWT_SECRET } = process.env;
					const credentials = {
						identifier: displayName,
						strategy: 'local',
					};
					const token = jwt.sign(credentials, JWT_SECRET);
					const domain = process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost';

					if(domain){
						res.cookie('jwt', token, { httpOnly: true, domain });
					} else {
						res.cookie('jwt', token, { httpOnly: true });
					}
				}
			}
			passport.authenticate('local-login', {
				successRedirect: '/account-profile',
				failureRedirect: '/login',
				failureFlash: true 
			})(req, res);
		});
		// Submit login form from react native
		app.post('/react-native-login', passport.authenticate('local-login'), async (req, res) => {
			if(req.body.nativeFlag && req.user){
				res.status(200).json(req.user);
			}
		});
		// Check if should perform JWT login
		app.get('/do-jwt-login', (req, res) => {
			return res.status(200).json(req.cookies.jwt && (!req.user));
		});

		// Google login
		let googleNativeFlag = false;
		app.get('/auth/google', (req, res, next) => {
			if(req.query.nativeFlag){
				googleNativeFlag = true;
			}
			next();
		}, passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
		app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {

			if(req.user && !req.cookies.jwt){
				const { JWT_SECRET } = process.env;
				const credentials = {
					identifier: req.user.googleID,
					strategy: 'google',
				};
				const token = jwt.sign(credentials, JWT_SECRET);
				const domain = process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost';

				if(domain){
					res.cookie('jwt', token, { httpOnly: true, domain });
				} else {
					res.cookie('jwt', token, { httpOnly: true });
				}
			}

			if(googleNativeFlag && req.user){
				googleNativeFlag = false;
				res.redirect(process.env.REACT_NATIVE_APP_URL + '?userID=' + String(req.user._id));
				return;
			} else {
				res.redirect('/account-profile');
				return;
			}
		});

		// Account register
		app.get('/register', (req, res) => {
			if(req.user){
				return res.redirect('/account-profile');
			}
			const errors = req.flash().error || [];
			res.render('register', { errors });
		});
		// Submit register form
		app.post('/register', passport.authenticate('local-signup', {
				successRedirect: '/account-profile',
				failureRedirect: '/register',
				failureFlash: true,
				successFlash: {
					type: 'messageSuccess',
					message: 'Successfully signed up.'
				}
			})
		);
		// Submit register form from react native
		app.post('/react-native-register', passport.authenticate('local-signup'), async (req, res) => {
			if(req.body.nativeFlag && req.user){
				res.status(200).json(req.user);
			}
		});

		// Account logout
		app.get('/logout', (req, res) => {
			res.clearCookie('jwt');
			req.logout();
			res.redirect('/login');
		});

		// Find user api for react native
		app.get('/user/:id', async (req, res) => {
			if(req.params.id){
				let user = await findUserByID(req.params.id);
				res.status(200).json(user);
			}
		});

		// Stripe account creation
		app.get('/manage-stripe-account/:accountID?', async (req, res) => {
			if(req.user){
				let account;
				if(req.params.accountID){
					account = await stripe.accounts.retrieve(req.params.accountID);

					// Redirect to Stripe login if already onboarded
					if(account.charges_enabled && account.payouts_enabled){
						return res.redirect('https://dashboard.stripe.com/login');
					}
				} else {
					account = await stripe.accounts.create({
						country: 'US',
						type: 'express',
						capabilities: {
							card_payments: {
								requested: true
							},
							transfers: {
								requested: true
							},
						},
						business_type: 'individual',
					});

					// Add connectedStripeAccountID to user
					await addStripeAccountIDToUser(req.user._id, account.id);
				}

				let return_url = process.env.SECURED_DOMAIN_WITH_PROTOCOL ? process.env.SECURED_DOMAIN_WITH_PROTOCOL : `http://localhost:${appPort}`;
				return_url += `/account-profile`;

				let refresh_url = process.env.SECURED_DOMAIN_WITH_PROTOCOL ? process.env.SECURED_DOMAIN_WITH_PROTOCOL : `http://localhost:${appPort}`;
				refresh_url += `/account-profile`;


				const accountLink = await stripe.accountLinks.create({
					account: account.id,
					return_url,
					refresh_url,
					type: 'account_onboarding',
				});

				return res.redirect(accountLink.url);
			}
		});

		// Stripe checkout
		app.post('/create-checkout-session', async (req, res) => {
			try {
				const priceID = req.body.priceID;
				const price = await stripe.prices.retrieve(priceID);

				const connectedStripeAccountID = req.body.connectedStripeAccountID;

				let success_url = process.env.SECURED_DOMAIN_WITH_PROTOCOL ? process.env.SECURED_DOMAIN_WITH_PROTOCOL : `http://localhost:${appPort}`;
				success_url += `/complete-order/${priceID}`;

				let cancel_url = process.env.SECURED_DOMAIN_WITH_PROTOCOL ? process.env.SECURED_DOMAIN_WITH_PROTOCOL : `http://localhost:${appPort}`;

				const session = await stripe.checkout.sessions.create({
					success_url,
					cancel_url,
					line_items: [
						{
							price: priceID,
							quantity: 1,
						},
					],
					mode: 'payment',
					payment_intent_data: {
						application_fee_amount: 123,
						transfer_data: {
							destination: connectedStripeAccountID,
						},
					},
				});
				return res.send(JSON.stringify(session));
			} catch(e) {
				console.log(e);
			}
		});
		app.get('/complete-order/:priceID', async (req, res) => {
			if(req.user && req.params.priceID){
				await completeOrder(req.user._id, req.params.priceID);
				return res.redirect('/account-profile');
			}
		});

		app.get('/web-rtc', async (req, res) => {
			return res.render('web-rtc');
		});
		app.post('/web-rtc-tokens', async (req, res) => {
			const firebaseConfig = {
				projectId: process.env.FIREBASE_PROJECT_ID,
				apiKey: process.env.FIREBASE_API_KEY,
				authDomain: process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost',
			};
			return res.json(firebaseConfig);
		});

		// Start app
		// app.listen(appPort, () => {
		// 	console.log(`App up on port ${appPort}`);
		// });
		const httpsOptions = {
			key: fs.readFileSync('./security/cert.key'),
			cert: fs.readFileSync('./security/cert.pem')
		}
		const server = https.createServer(httpsOptions, app)
			.listen(appPort, () => {
				console.log(`App up on port ${appPort}`);
			});
	} catch(err){
		console.log(`Error: ${err}`);
	}
})();
