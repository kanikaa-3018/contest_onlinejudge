require("dotenv").config();
const nodemailer = require("nodemailer");

// Create the transporter
const transporter = nodemailer.createTransport({
  secure: true,
  port: 465,
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,  //replace with real gmail
    pass: process.env.EMAIL_PASS,  //replace with real password
  },
});

// Email subject
const emailSubject = "Welcome to Movie Explorer";

// Email body template
const emailBody = (username) => `
Hi ${username},

Welcome to **Movie Explorer**! 🎬 We're excited to have you on board.

Here's what you can do:
- Discover and explore a wide range of movies
- Create your personal watchlist
- Share movie recommendations with your friends

Start your movie journey now by diving into the latest collections and hidden gems!

If you have any questions or need help, feel free to reach out. We're here for you.

Happy exploring!  
— The Movie Explorer Team
`;

// Function to send the email
function sendMail(to, username) {
  transporter.sendMail(
    {
      to,
      subject: emailSubject,
      text: emailBody(username),
    },
    (err, info) => {
      if (err) {
        console.log("❌ Error sending email:", err);
      } else {
        console.log("✅ Email sent:", info.response);
      }
    }
  );
}

module.exports = sendMail;
