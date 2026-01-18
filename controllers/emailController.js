const { sendEmailTo } = require("../mainService/emailService");
const Email = require("../models/Email");

const baseSendEmail = async (req, res) => {
  try {
    const success = await sendEmailTo({
      emailTo: req.body.emailTo,
      actions: req.body.actions,
      tempPassword: req.body.tempPassword,
      auth: req.body.auth, // 🔴 مهم
    });

    if (!success) {
      return res.status(502).json({
        success: false,
        message: "Email service failed",
      });
    }

    const newEmail = await Email.create({
      to: req.body.emailTo,
      subject: req.body.actions,
    });

    return res.status(201).json({
      success: true,
      message: "Email sent successfully",
      data: newEmail,
    });

  } catch (error) {
    console.error("Error in baseSendEmail:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { baseSendEmail };
