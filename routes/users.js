const { sendEmail } = require('../app/email.js');
const { findUserByID, addStripeAccountIDToUser, setVerifiedEmail } = require('../database/methods/users.js');

module.exports.defineUserRoutes = function(app) {

  // Find users route
  app.get('/find-users', (req, res) => {
    let userID = null;
    if(req.user){
      userID = req.user._id;
    }
    res.render('find-users', { userID });
  });

  // Get authenticated user ID
  app.get('/current-user-id', (req, res) => {
    if(req.user){
      return res.json(req.user._id);
    }
    res.sendStatus(404);
  });

  // Send email via ajax request
  app.post('/send-email-to-user', async (req, res) => {
    const { subject, content, forUserID } = req.body;
    if (req.user && forUserID && subject && content) {
      if (req.user.verifiedEmail || subject === 'Email Verification') {
        const user = await findUserByID(forUserID);
        const emailResponse = await sendEmail(user.email, subject, content, (account) => res.json(account));
      }
    }
  });


  // Find user api for react native
  app.get('/user/:id', async (req, res) => {
    if(req.params.id){
      let user = await findUserByID(req.params.id);
      if ((new RegExp(req.ip)).test(process.env.REACT_NATIVE_APP_URL)) {
        res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_APP_URL);
      } else if ((new RegExp(req.hostname)).test(process.env.REACT_NATIVE_WEB_APP_URL)) {
        res.header('Access-Control-Allow-Origin', process.env.REACT_NATIVE_WEB_APP_URL);
      }
      res.status(200).json(user);
    }
  });

  // Process Email Verification
  app.get('/verify-email', async (req, res) => {
    if (req.user) {
      const user = req.user;
      const { email, userID } = req.query;
      const requestEmail = decodeURIComponent(email);

      if (String(user._id) === userID && user.email === requestEmail) {
        const updatedUser = await setVerifiedEmail(user._id, true);
        return res.redirect('/account-profile-edit');
      } else {
        res.sendStatus(404);
      }
    } else {
      return res.redirect('/login');
    }
  });

}

