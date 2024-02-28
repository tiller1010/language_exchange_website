const { findAndSyncUser } = require('../database/methods/users.js');
const { myCipher } = require('../app/cipher.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');
const { getConnectedStripeAccountID } = require('../app/getConnectedStripeAccountID.js');

const isLive = process.env.APP_ENV == 'production';

module.exports.defineAccountProfileRoutes = function(app) {

	// Account profile
	app.get('/account-profile/:viewOtherUserID?',
		async (req, res) => {
			if(req.params.viewOtherUserID){
				let user = await findAndSyncUser(req.params.viewOtherUserID, 'id');
				let isCurrentUser = req.user ? String(req.user._id) == String(user._id) : false;

        const title = isCurrentUser ? 'My Profile' : `${user.displayName}'s Profile`;

				const props = {
          title,
					userID: user._id,
					authenticatedUserID: req.user ? req.user._id : null,
					isCurrentUser,
					pathResolver: '../',
				};

				if (isLive) {
					return res.render('account-profile', {
            title,
            p: myCipher(JSON.stringify(props)),
            isLive,
            pathResolver: props.pathResolver,
          });
				} else {
					return res.render('account-profile', props);
				}
			} else if(req.user){
				let user = req.user;

				let stripeAccountPending = true;
        const connectedStripeAccountID = getConnectedStripeAccountID(user);
				if (connectedStripeAccountID) {
					try {
						const account = await stripe.accounts.retrieve(connectedStripeAccountID);
						stripeAccountPending = !(account.charges_enabled && account.payouts_enabled);
					} catch(e) {
						console.log(e);
					}
				}

        const title = 'My Profile';

				const props = {
          title,
					userID: user._id,
					authenticatedUserID: req.user._id,
					isCurrentUser: true,
					stripeAccountPending,
					pathResolver: ''
				}

				if (isLive) {
					res.render('account-profile', {
            title,
            p: myCipher(JSON.stringify(props)),
            isLive,
            pathResolver: props.pathResolver,
          });
				} else {
					return res.render('account-profile', props);
				}
			} else {
				return res.redirect('/login');
			}
		}
	);

	// Edit account profile
	app.get('/account-profile-edit',
		async (req, res) => {
			if(req.user){
				let user = req.user;

				const props = {
					userID: req.user._id,
				};
				if (isLive) {
					res.render('account-profile-edit', { p: myCipher(JSON.stringify(props)), isLive });
				} else {
					return res.render('account-profile-edit', props);
				}
			} else {
				return res.redirect('/login');
			}
		}
	);
}
