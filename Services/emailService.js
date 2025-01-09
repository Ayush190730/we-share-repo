const nodemailer = require("nodemailer");
const router = require("../routes/fileRoute");

async function sendMail({ from, to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    debug : true,
  });

  const info = await transporter.sendMail({
    from : `weShare <${from}>`,
    to,
    subject,
    text,
    html,
  });


}

module.exports = sendMail;
