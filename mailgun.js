const mailgun = require("mailgun-js");
// const DOMAIN = process.env.DOMAIN;
const mg = mailgun({
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN,
});
const data = {
  from: "nodeexpress2023@gmail.com",
  to: "polonkoev.temerlan@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomness!",
};
mg.messages().send(data, function (error, body) {
  console.log(body, error);
});
