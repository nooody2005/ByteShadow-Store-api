// const { Resend } = require('resend');
// const pug = require('pug');
// const { htmlToText } = require('html-to-text');

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = 'Byte Shadow <noreply@byteshadow.art>';
//   }

//   async send(template, subject) {
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject
//     });

//     const text = htmlToText(html);

//     const resend = new Resend(process.env.RESEND_API_KEY);

//     const { data, error } = await resend.emails.send({
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text
//     });

//     if (error) {
//       console.error('RESEND EMAIL ERROR:', error);
//       throw new Error('Failed to send email through Resend');
//     }

//     console.log('RESEND: email accepted:', data.id);
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'welcome to the ByteShadow family :)');
//   }

//   async sendPasswordReset() {
//     await this.send('passwordResetEmail', 'Your password reset link');
//   }
// };

// =======================================================================================================


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

  // Notify a bidder when someone places a higher bid
  async sendOutbidNotification(painting, newBid) {
    const paintingUrl = `${process.env.BASE_URL}/painting/${painting.slug}`;

    const subject = `Someone outbid you on ${painting.name}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #1e1519;">
        <h2>Hi ${this.firstName},</h2>
        <p>Someone has placed a higher bid on the painting
          <strong>${painting.name}</strong>.
        </p>
        <p>The new highest bid is <strong>${newBid} EGP</strong>.</p>
        <p>You can visit the painting and place a higher bid if you wish.</p>
        <p>
          <a href="${paintingUrl}"
             style="display:inline-block; padding:12px 20px; background:#837f81; color:white; text-decoration:none; border-radius:5px;">
            View Painting & Place a Bid
          </a>
        </p>
        <p>Good luck!<br>Byte Shadow</p>
      </div>
    `;

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
      console.error('RESEND OUTBID EMAIL ERROR:', error);
      throw new Error('Failed to send outbid notification');
    }

    console.log('RESEND: outbid email accepted:', data.id);
  }

  // send congratulations message to winner

  async sendWinnerNotification(painting) {
    const subject = `Congratulations! You won ${painting.name}`;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #1e1519;">
      <h2>Congratulations, ${this.firstName}!</h2>

      <p>You won the auction for <strong>${painting.name}</strong>.</p>

      <p>
        You have <strong>24 hours from the auction's end time</strong>
        to complete your payment.
      </p>

      <p>
        If you don't pay before the deadline, your reservation will expire
        and the painting will no longer be reserved for you.
      </p>

      <p>
        Log in to your account to find your painting in the
        <strong>Winner</strong> section and click <strong>Pay Now</strong>.
      </p>

      <p>
        <a href="${this.url}"
           style="display:inline-block; padding:12px 20px; background:#837f81; color:white; text-decoration:none; border-radius:5px;">
          Go to My Account
        </a>
      </p>

      <p>Thank you for supporting Byte Shadow!<br>Byte Shadow</p>
    </div>
  `;

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
      console.error('RESEND WINNER EMAIL ERROR:', error);
      throw new Error('Failed to send winner notification');
    }

    console.log('RESEND: winner email accepted:', data.id);
  }
};




















// ============================================================================

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
