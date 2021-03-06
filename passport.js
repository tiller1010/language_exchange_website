var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var { addUser, findUser } = require('./users.js');

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_AUTH_ID,
	clientSecret: process.env.GOOGLE_AUTH_SECRET,
	callbackURL: '/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
		const newUser = {
			googleID: profile.id,
			displayName: profile.displayName,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			image: profile.photos[0]
		}

		try {
			let user = await findUser(profile.id);

			if(user){
				done(null, user);
			} else {
				let user = await addUser(newUser);
				done(null, user);
			}
		} catch(error) {
			console.log(error);
		}
	}
));

passport.serializeUser((user, done) => {
	done(null, user.googleID);
});

passport.deserializeUser( async (googleID, done) => {
	const user = await findUser(googleID);
	done(null, user);
});

module.exports.passport = passport;