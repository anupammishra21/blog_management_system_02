const nodemailer = require('nodemailer');
class Mailer {
    constructor() {

    }
    async sendMail(from, to, subject, html) {
        try {

            //Setup transporter
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.APP_PASSWORD
                }
            });

            //Setup the mail options

            let mail_options = {
                from, 
                to,
                subject,
                html
            }
            //Fire the mail
            return await transporter.sendMail(mail_options);

        }catch(err) {
            console.log(err);
            return err;
        }
    }
}
module.exports = new Mailer();