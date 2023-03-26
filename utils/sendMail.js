function sendMail(mail, verifiCode) {
  const nodemailer = require("nodemailer");
  require("dotenv").config();

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "xottabych06@mail.ru", // sender address
    to: `${mail}`, // list of receivers
    subject: "Confirm your email", // Subject line
    text: `localhost:3000/api/users/verify/${verifiCode}`, // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    console.log("Message sent: %s", info.messageId);
  });
}
module.exports = sendMail;
