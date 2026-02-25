const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

/* REGISTER */
exports.register = async (req, res) => {
  try {
    const { role, fullName, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    if (!role || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.createUser(
      {
        role,
        fullName,
        email,
        password: hashedPassword,
        profileImage
      },
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
          }
          return res.status(500).json({ message: err.message });
        }

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* LOGIN */
/* LOGIN */
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    // 🔥 IMPORTANT: Return structured object
    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  });
};
