const { sendEmail } = require('../app/email.js');
const { findUserByID, addStripeAccountIDToUser } = require('../database/methods/users.js');

module.exports.defineUserRoutes = function(app) {

	// Find users route
	app.get('/find-users', (req, res) => {
		let userID = null;
		if(req.user){
			userID = req.user._id;
		}
		res.render('find-users', { userID });
	});

	// Send email via ajax request
	app.post('/send-email-to-user', async (req, res) => {
		const { subject, content, forUserID } = req.body;
		if (req.user && forUserID && subject && content) {
			const user = await findUserByID(forUserID);
			const emailResponse = await sendEmail(user.email, subject, content, (account) => res.json(account));
		}
	});

}

