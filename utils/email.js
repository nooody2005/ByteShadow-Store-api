const { Resend } = require('resend');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Byte Shadow <noreply@byteshadow.art>';
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const text = htmlToText(html);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: this.from,
      to: this.to,
      subject,
      html,
      text
    });

    if (error) {
      console.error('RESEND EMAIL ERROR:', error);
      throw new Error('Failed to send email through Resend');
    }

    console.log('RESEND: email accepted:', data.id);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the ByteShadow family :)');
  }

  async sendPasswordReset() {
    await this.send('passwordResetEmail', 'Your password reset link');
  }
};










// const nodemailer = require('nodemailer');
// const pug = require('pug');
// // const text = require('html-to-text');
// const { htmlToText } = require('html-to-text');

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Nooody2005std<${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       return nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: Number(process.env.EMAIL_PORT),
//         secure: Number(process.env.EMAIL_PORT) === 465,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD
//         }
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT),
//       secure: Number(process.env.EMAIL_PORT) === 465,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });
//   }
//   //send Acutal email
//   async send(template, subject) {
//     // 1) Render HTML based on a pug template
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject
//     });

//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,

//       text: htmlToText(html)

//     };

//     // 3)  create a trasport and send email

//     // 3) Create a transport and send email
//   const transporter = this.newTransport();

//     try {
//       console.log('EMAIL: verifying SMTP connection');

//       await transporter.verify();

//       console.log('EMAIL: SMTP connection verified');
//       console.log('EMAIL: sending message');

//       const info = await transporter.sendMail(mailOptions);

//       console.log('EMAIL: message accepted by SMTP server');
//       console.log('EMAIL: response:', info.response);
//     } catch (err) {
//       console.error('EMAIL SMTP ERROR:', {
//         name: err.name,
//         code: err.code,
//         command: err.command,
//         responseCode: err.responseCode,
//         response: err.response,
//         message: err.message
//       });

//       throw err;
//     }
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'welcome to the Natours family :)');
//   }

//   async sendPasswordReset() {
//     await this.send('passwordResetEmail', 'Your password reset link');
//   }
// };

// module.exports = sendEmail;
