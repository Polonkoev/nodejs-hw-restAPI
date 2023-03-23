const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(
  "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"
);

const msg = {
  to: "xottabych06@mail.ru",
  from: "nodeexpress2023@gmail.com",
  subject: "Sending with SendGrid ",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error("Ошибка от сангрида", error);
  });
