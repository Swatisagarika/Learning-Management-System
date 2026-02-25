const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const forgotModel = require("../models/forgotModel");
const db = require("../config/db");

const { generateOtp, hashOtp } = require("../utils/otpHelper");


/* =========================
   SEND OTP
========================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Check user in USERS table (IMPORTANT FIX)
    const [users] = await db.query(
      "SELECT * FROM lms.users WHERE email = ?",
      [email]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    await forgotModel.saveOtp(email, hashedOtp, expireTime);

    /* Email Sender */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // ✅ Get OTP record
    const user = await forgotModel.findUserByEmail(email);

    if (!user)
      return res.status(404).json({ message: "OTP request not found" });

    // OTP Expiry Check
    if (new Date(user.reset_otp_expire) < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // Attempt Limit
    if (user.otp_attempts >= 5)
      return res.status(403).json({ message: "Too many attempts" });

    const hashedOtp = hashOtp(otp);

    if (hashedOtp !== user.reset_otp) {
      await forgotModel.incrementAttempts(email);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    /* =========================
       UPDATE PASSWORD
    ========================= */

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await forgotModel.updatePassword(email, hashedPassword);

    // ✅ Delete OTP record after success
    await forgotModel.deleteOtpRecord(email);

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
