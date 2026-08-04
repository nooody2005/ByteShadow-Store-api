const nodemailer = require('nodemailer');
const pug = require('pug');
// const text = require('html-to-text');
const { htmlToText } = require('html-to-text');


module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Nooody2005std<${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production'){
      //sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth:{
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      
    }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

  // newTransport(){
  //   if (process.env.NODE_ENV === 'production'){
  //     //sendgrid
  //     return 1;
  //   }

  // return nodemailer.createTransport({

  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //   //   secure: false,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD
  //     }
  //     // Activate in gmail "less seecure app" option
  //   });

  // nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });

  // }

  //send Acutal email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text:text.htmlToText.fromString(html)
      text: htmlToText(html)
      // html:
    };

    // 3)  create a trasport and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the Natours family :)');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'your password reset token (valid for only 10 mintues :)');
  }
};

// module.exports = sendEmail;