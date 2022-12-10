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
const { addUser, findAndSyncUser, findUserByID, addCompletedTopic, removeCompletedTopic, addStripeAccountIDToUser } = require('./database/methods/users.js');
const { completeOrder } = require('./database/methods/products.js');

// Strapi Methods
const { getLevel } = require('./strapi/levels.js');
const { getTopic, getTopicChallenges } = require('./strapi/topics.js');

// App Services
const { passport } = require('./app/passport.js');
const bcrypt = require('bcrypt');
const createSearchService = require('./app/search.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');
const { sendEmail } = require('./app/email.js');

// GraphQL
const { installHandler } = require('./graphql/api_handler.js');
const { graphqlUploadExpress } = require('graphql-upload');

// Routes
const { defineHomeRoutes } = require('./routes/home.js');
const { defineLessonRoutes } = require('./routes/lessons.js');
const { defineAccountProfileRoutes } = require('./routes/accountProfile.js');
const { defineVideoRoutes } = require('./routes/videos.js');
const { defineLikeRoutes } = require('./routes/likes.js');

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

		// Chats route
		app.get('/chats', (req, res) => {
			let userID = null;
			if(req.user){
				userID = req.user._id;
			}
			res.render('chats', { userID });
		});

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

			let passportConfig = {
				failureRedirect: '/login',
				failureFlash: true,
			}

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

					passportConfig.successRedirect = '/account-profile';
				}
			} else if (req.cookies.jwt && req.body.backURL) {
				passportConfig.successRedirect = req.body.backURL;
			}
			passport.authenticate('local-login', passportConfig)(req, res);
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
		}, passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login', 'email' ] }));
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
			res.clearCookie('jwt', { domain: process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL });
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

		// Find users route
		app.get('/find-users', (req, res) => {
			let userID = null;
			if(req.user){
				userID = req.user._id;
			}
			res.render('find-users', { userID });
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

				const base_url = process.env.SECURED_DOMAIN_WITH_PROTOCOL ? process.env.SECURED_DOMAIN_WITH_PROTOCOL : `http${appPort == 443 ? 's' : ''}://localhost:${appPort}`;

				const return_url = `${base_url}/account-profile`;
				const refresh_url = `${base_url}/account-profile`;

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

				const base_url = process.env.SECURED_DOMAIN_WITH_PROTOCOL ? process.env.SECURED_DOMAIN_WITH_PROTOCOL : `http${appPort == 443 ? 's' : ''}://localhost:${appPort}`;

				const success_url = `${base_url}/complete-order/${priceID}`;
				const cancel_url = base_url;

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
				await sendEmail(req.user.email, `${process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL}> Chat Order`, "<b>Thank you for your order. Go to your account products on the time of the chat.</b>");
				return res.redirect('/account-profile');
			}
		});

		app.get('/video-chat', async (req, res) => {
			let userID = null;
			if(req.user){
				userID = req.user._id;
			}
			return res.render('video-chat', { authenticatedUserID: userID });
		});
		app.post('/video-chat-tokens', async (req, res) => {
			const firebaseConfig = {
				projectId: process.env.FIREBASE_PROJECT_ID,
				apiKey: process.env.FIREBASE_API_KEY,
				authDomain: process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost',
			};
			return res.json(firebaseConfig);
		});

		app.post('/send-email-to-user', async (req, res) => {
			const { subject, content, forUserID } = req.body;
			if (req.user && forUserID && subject && content) {
				const user = await findUserByID(forUserID);
				const emailResponse = await sendEmail(user.email, subject, content, (account) => res.json(account));
			}
		});

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
