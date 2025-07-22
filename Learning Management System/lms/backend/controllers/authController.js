const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const transporter = require("../config/nodemailer");
const { generateResetToken } = require("../utils/generateToken");

// Register new user
exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(fullName, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Forgot Password – Send Reset Link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    await User.saveResetToken(email, token, expiresAt);

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"LMS Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
