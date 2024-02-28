const { findAndSyncUser } = require('../database/methods/users.js');
const { passport } = require('../app/passport.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.defineAuthenticationRoutes = function(app) {

  // Account login
  app.get('/login', (req, res) => {
    if(req.user){
      return res.redirect('/account-profile');
    }
    const errors = req.flash().error || [];
    res.render('login', {
      title: 'Login',
      errors,
    });
  });

  // Submit login form
  app.post('/login', async (req, res, next) => {
    // Set JWT cookie to stay signed in
    const { displayName, password } = req.body;

    let passportConfig = {
      successRedirect: '/account-profile',
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

        passportConfig.successRedirect = req.body.backURL ? req.body.backURL : '/account-profile';
      }
    } else if (req.cookies.jwt && req.body.backURL) {
      passportConfig.successRedirect = req.body.backURL;
    }
    passport.authenticate('local-login', passportConfig)(req, res, next);
  });

  // Submit login form from react native
  app.post('/react-native-login', passport.authenticate('local-login'), async (req, res) => {
    if(req.body.nativeFlag && req.user){
      if ((new RegExp(req.ip)).test(process.env.REACT_NATIVE_APP_URL)) {
        res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_APP_URL);
      } else if ((new RegExp(req.hostname)).test(process.env.REACT_NATIVE_WEB_APP_URL)) {
        res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_WEB_APP_URL);
      }
      res.status(200).json(req.user);
    }
  });

  // Check if should perform JWT login
  app.get('/do-jwt-login', (req, res) => {
    return res.status(200).json(req.cookies.jwt && (!req.user));
  });

  // Google login
  let googleNativeFlag = false;
  let googleBackURL = '';
  app.get('/auth/google', (req, res, next) => {
    const { backURL, nativeFlag } = req.query;
    if (nativeFlag) {
      googleNativeFlag = true;
    }
    googleBackURL = backURL || '';
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
      const successRedirect = googleBackURL ? googleBackURL : '/account-profile';
      googleBackURL = '';
      res.redirect(successRedirect);
      return;
    }
  });

  // Account register
  app.get('/register', (req, res) => {
    if(req.user){
      return res.redirect('/account-profile');
    }
    const errors = req.flash().error || [];
    res.render('register', {
      title: 'Register',
      errors,
    });
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

  // Forgot Password
  app.get('/forgot-password', (req, res) => {
    const errors = req.flash().error || [];
    res.render('forgot-password', { errors });
  });

  // Reset Password
  app.get('/reset-password', (req, res) => {
    const errors = req.flash().error || [];
    res.render('reset-password', { errors });
  });
  app.post('/reset-password', (req, res) => {
    const { userID } = req.body;
    passport.authenticate('local-password-reset', {
      successRedirect: '/account-profile',
      failureRedirect: req.url + '?userID=' + userID,
      failureFlash: true,
      successFlash: {
        type: 'messageSuccess',
        message: 'Successfully updated password.'
      }
    })(req, res);
  });

}
