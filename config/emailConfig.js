  const nodemailer = require("nodemailer");
  
   const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password only
    },
    
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    logger: true,
    debug: true,
  });

  module.exports = { transporter };