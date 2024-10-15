const cron = require('node-cron');
const userServices = require('../Services/services'); // Adjust the path to your user services
const { sendEmail } = require('./sendMail');

// Cron job to check for users who haven't logged in for 10 days
cron.schedule('0 0 * * *', async () => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Find users who haven't logged in for the last 10 days
    const users = await userServices.find({ lastLogin: { $lt: tenDaysAgo } });

    // Send reminder emails to those users
    for (let user of users) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'We Miss You at Educonnect!',
        text: `Hi ${user.firstName},\n\nWe noticed you haven't logged in for over 10 days. Come back and continue learning!`,
      };
      
      // Send email
      await sendEmail(mailOptions);
      console.log(`Reminder email sent to ${user.email}`);
    }
  } catch (err) {
    console.log('Error in cron job:', err);
  }
});



// const cron = require('node-cron');
// const { sendEmail } = require('./sendMail');
// const { userServices } = require('../Services/services');

// // Cron job to check for users who haven't logged in for 5 minutes
// cron.schedule('*/5 * * * *', async () => {
//   try {
//     console.log("crom ready");
//     const fiveMinutesAgo = new Date();
//     fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

//     // Find users who haven't logged in for the last 5 minutes
//     const users = await userServices.find({ lastLogin: { $lt: fiveMinutesAgo } });

//     // Send reminder emails to those users
//     for (let user of users) {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: 'It’s been a while!',
//         text: `Hi ${user.firstName},\n\nWe noticed you haven’t logged in for the last 5 minutes. We’re eager to see you back and learning with Educonnect!`,
//       };
      
//       // Send email
//       await sendEmail(mailOptions);
//       console.log(`Reminder email sent to ${user.email}`);
//     }
//   } catch (err) {
//     console.log('Error in cron job:', err);
//   }
// });
