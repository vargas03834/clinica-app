const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (to, subject, html) => {
  await transporter.sendMail({ from: process.env.EMAIL, to, subject, html });
};