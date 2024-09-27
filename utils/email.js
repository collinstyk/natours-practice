/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  //  Create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // mailerSend
      return nodemailer.createTransport({
        host: 'smtp.mailersend.net',
        port: 587,
        auth: {
          user: process.env.MAILER_USERNAME,
          pass: process.env.MAILER_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Send the actual email
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  // async sendWelcome() {
  //   await this.send('welcome', 'Welcome to the natours family!');
  // }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }

  async sendConfirmEmail() {
    await this.send('confirmEmail', 'Confirm your email.');
  }
};
