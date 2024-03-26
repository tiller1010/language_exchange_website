const { sendEmail } = require('../app/email.js');

module.exports.defineReportABugRoutes = (app) => {

  app.get('/report-a-bug', (req, res) => {
    const flash = req.flash();
    const errors = flash.error || [];
    const successMessage = flash.successMessage || '';
    res.render('report-a-bug', { errors, successMessage });
  });

  app.post('/report-a-bug', async (req, res) => {
    const { email, description } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    await sendEmail(adminEmail, 'Bug Report', `Email: ${email}\nDescription: ${description}`);
    req.flash('successMessage', 'Bug report submitted!');
    res.redirect('/report-a-bug');
  });

};

