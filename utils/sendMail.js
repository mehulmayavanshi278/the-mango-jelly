const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider, like 'gmail'
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  // Email options


  async function sendEmail(mailOptions){
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ message: 'Error sending email' });
        } else {
          console.log("otp send");
          return;
    
        }
      });
  }



  module.exports.sendEmail = sendEmail;