const transporter = require("../config/emailConfig").transporter;

/**
 * Send email based on action type
 * @param {string} emailTo - Recipient email address
 * @param {string|string[]} actions - Action type(s)
 * @param {string} tempPassword - Temporary password (or OTP for send_otp)
 * @returns {Promise<boolean>}
 */
const sendEmailTo = async (emailTo, actions, tempPassword) => {
  try {
    if (!emailTo || !isValidEmail(emailTo)) {
      throw new Error("Invalid email address");
    }

    const actionList = Array.isArray(actions) ? actions : [actions];

    // IMPORTANT: Use the authenticated Gmail account as the sender (DMARC alignment)
    const FROM = `AMP Portal <${process.env.EMAIL_USER}>`;

    // ---- add_new_user ----
    if (actionList.includes("add_new_user")) {
      const mailOptions = {
        from: FROM,
        to: emailTo,
        subject: "Welcome to AMP - Your Account Details",
        html: generateWelcomeEmailHTML(tempPassword, emailTo),
        text: generateWelcomeEmailText(tempPassword, emailTo),
      };

      const info = await transporter.sendMail(mailOptions);
      logSendMailInfo(info);

      console.log("✅ Welcome email sent successfully to:", emailTo);
      return true;
    }

    // ---- send_otp ----
    if (actionList.includes("send_otp")) {
      const otp = tempPassword; // OTP passed in tempPassword
      const mailOptions = {
        from: FROM,
        to: emailTo,
        subject: "Your OTP Verification Code",
        html: generateOTPEmailHTML(otp),
        text: generateOTPEmailText(otp),
      };

      const info = await transporter.sendMail(mailOptions);
      logSendMailInfo(info);

      console.log("✅ OTP email sent successfully to:", emailTo);
      return true;
    }

    // ---- Test_v1 ----
    if (actionList.includes("Test_v1")) {
      const mailOptions = {
        from: FROM,
        to: emailTo,
        subject: "Test - AMP Email Delivery",
        text: `hello ${tempPassword ?? ""}`.trim(),
      };

      const info = await transporter.sendMail(mailOptions);
      logSendMailInfo(info);

      console.log("✅ Test email sent successfully to:", emailTo);
      return true;
    }

    console.warn("⚠️ No valid action specified:", actionList);
    return false;
  } catch (error) {
    console.error("❌ Failed to send email:", error?.message || error);
    // خيار 1: ترجع false بدل ما تعمل throw
    // return false;

    // خيار 2: ترفع الخطأ للـcaller (زي كودك الأصلي)
    throw error;
  }
};

/**
 * Print Nodemailer sendMail info
 */
function logSendMailInfo(info) {
  console.log("messageId:", info?.messageId);
  console.log("accepted:", info?.accepted);
  console.log("rejected:", info?.rejected);
  console.log("response:", info?.response);
}

/**
 * Validate email format
 */
function isValidEmail(emailTo) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailTo);
}

/**
 * Generate Welcome Email HTML (Clean & Safe HTML)
 */
function generateWelcomeEmailHTML(tempPassword, emailTo) {
  const safePass = tempPassword ? String(tempPassword) : "";

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background:#f8f9fa;">
    <div style="background:#059669; padding:24px; border-radius:12px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:24px;">Welcome to AMP</h1>
      <p style="color:#eafff6; margin:10px 0 0;">Your account has been created</p>
    </div>

    <div style="background:#fff; padding:24px; margin-top:14px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,.08);">
      <p style="color:#374151; font-size:15px; margin:0 0 12px;">
        <strong>Email:</strong> ${emailTo || "Your registered email"}
      </p>

      ${
        safePass
          ? `
      <div style="background:#f3f4f6; border-left:4px solid #10b981; border-radius:8px; padding:16px; margin:16px 0;">
        <p style="margin:0 0 8px; color:#374151;"><strong>Temporary Password:</strong></p>
        <div style="background:#fff; border:2px dashed #10b981; border-radius:10px; padding:14px; text-align:center;">
          <span style="font-size:22px; font-weight:700; color:#10b981; font-family:monospace;">${safePass}</span>
        </div>
      </div>
      `
          : ""
      }

      <div style="background:#fef3c7; border-left:4px solid #f59e0b; padding:12px; border-radius:8px; margin:16px 0;">
        <p style="color:#92400e; margin:0; font-size:13px;">
          <strong>Important:</strong> Please change your password after your first login.
        </p>
      </div>

      <p style="color:#6b7280; font-size:13px; margin-top:18px;">
        For security reasons, never share your password with anyone.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;" />

      <p style="text-align:center; color:#9ca3af; font-size:12px; margin:0;">
        © 2025 AMP Portal. All rights reserved.
      </p>
    </div>
  </div>
  `.trim();
}

/**
 * Generate Welcome Email Plain Text
 */
function generateWelcomeEmailText(tempPassword, emailTo) {
  const safePass = tempPassword ? String(tempPassword) : "";

  return `
Welcome to AMP Portal!

Your account has been successfully created.

Email: ${emailTo}

${safePass ? `Temporary Password: ${safePass}` : ""}

IMPORTANT: Please change your password after your first login.

For security reasons, never share your password with anyone.

© 2025 AMP Portal. All rights reserved.
  `.trim();
}

/**
 * Generate OTP Email HTML
 */
function generateOTPEmailHTML(otp) {
  const safeOtp = otp ? String(otp) : "";

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background:#f8f9fa;">
    <div style="background:#059669; padding:24px; border-radius:12px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:22px;">Verification Code</h1>
    </div>

    <div style="background:#fff; padding:24px; margin-top:14px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,.08);">
      <p style="color:#374151; font-size:15px; margin:0 0 12px;">
        Use the following OTP code to complete your action:
      </p>

      <div style="background:#f3f4f6; border:2px dashed #10b981; border-radius:10px; padding:16px; text-align:center; margin:16px 0;">
        <span style="font-size:28px; font-weight:700; color:#10b981; letter-spacing:6px; font-family:monospace;">${safeOtp}</span>
      </div>

      <p style="color:#6b7280; font-size:13px; margin:0;">
        This code will expire in <strong>5 minutes</strong>.<br/>
        For security reasons, never share this code with anyone.<br/>
        If you didn't request this code, please ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;" />

      <p style="text-align:center; color:#9ca3af; font-size:12px; margin:0;">
        © 2025 AMP Portal. All rights reserved.
      </p>
    </div>
  </div>
  `.trim();
}

/**
 * Generate OTP Email Plain Text
 */
function generateOTPEmailText(otp) {
  const safeOtp = otp ? String(otp) : "";

  return `
Your OTP verification code is: ${safeOtp}

This code will expire in 5 minutes.
For security reasons, never share this code with anyone.
If you didn't request this code, please ignore this email.

© 2025 AMP Portal. All rights reserved.
  `.trim();
}

module.exports = { sendEmailTo };
