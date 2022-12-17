const stripe = require('stripe')(process.env.STRIPE_SECRET || '');
const { sendEmail } = require('../app/email.js');
const { addStripeAccountIDToUser } = require('../database/methods/users.js');
const { completeOrder } = require('../database/methods/products.js');

module.exports.defineStripeRoutes = function(app) {

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
}