require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
client.messages
  .create({
    body: "Test OTP",
    from: process.env.TWILIO_PHONE,
    to: "+91XXXXXXXXXX",
  })
  .then((msg) => console.log("Sent:", msg.sid))
  .catch((err) => console.error(err));
module.exports = client;
