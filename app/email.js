const nodemailer = require("nodemailer");

async function sendEmail(toEmail, subject, content, localTestingCallback = false) {
	// If Live
	if (process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL && process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL != 'localhost') {
		(async function() {
			var transporter = nodemailer.createTransport({
				host: "mail." + process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL,
				port: 25,
				secure: false,
			});

			try {
				var info = await transporter.sendMail({
					from: `"Openeducationapp" <noreply@${process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL}>`, // sender address
					to: toEmail,
					subject,
					html: content,
				});

			} catch(error) {
				console.log(error);
			}
		})();
	} else {
		nodemailer.createTestAccount(async (err, account) => {
			var transporter = nodemailer.createTransport({
				host: "smtp.ethereal.email",
				port: 587,
				secure: false,
				auth: {
					user: account.user, // generated ethereal user
					pass: account.pass  // generated ethereal password
				},
			});

			try {
				var info = await transporter.sendMail({
					from: `"Openeducationapp" <noreply@${process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL}>`, // sender address
					to: toEmail,
					subject,
					html: content,
				});

			} catch(error) {
				console.log(error);
			}

			if (localTestingCallback) {
				localTestingCallback(account);
			}
		});
	}
}

module.exports = { sendEmail, }