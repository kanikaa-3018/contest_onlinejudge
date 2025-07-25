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
const emailSubject = "Welcome to CodeArena";

// Email body template
const emailBody = (username) => `
Hi ${username},

Welcome to **CodeArena**! 🚀  
We’re thrilled to have you join our growing community of coders, collaborators, and future tech leaders.

Here’s what you can explore right away:
- 💻 Compete in real-time coding contests
- 🤖 Get intelligent feedback from our AI agents
- 🧳 Track your internship applications easily
- 🤝 Collaborate with peers in live coding rooms

Your journey to smarter coding and career growth starts now.

If you ever need help or have feedback, we’re just a message away.

Happy Coding!  
— The CodeArena Team
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
