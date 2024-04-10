const { sendEmail } = require('../app/email.js');

module.exports.defineBecomeVerifiedRoutes = (app) => {

  app.get('/become-verified', (req, res) => {
    const flash = req.flash();
    const errors = flash.error || [];
    const successMessage = flash.successMessage || '';
    res.render('become-verified', { errors, successMessage });
  });

  app.post('/become-verified', async (req, res) => {
    const { email, description } = req.body;
    const user = req.user;
    if (!user) {
      req.flash('error', 'You must be logged in to submit a verification request.');
      return res.redirect('/become-verified');
    }
    const userID = user._id;
    const adminEmail = process.env.ADMIN_EMAIL;
    await sendEmail(adminEmail, 'Verification Request', `User ID: ${userID}\nEmail: ${email}\nDescription: ${description}`);
    req.flash('successMessage', 'Verification request submitted!');
    res.redirect('/become-verified');
  });

};

