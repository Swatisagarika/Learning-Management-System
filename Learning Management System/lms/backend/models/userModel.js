const db = require("../config/db");

// Find user by email
exports.findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM lms.users WHERE email = ?", [email]);
  return rows[0]; // Return single user object
};

// Create new user
exports.createUser = async (fullName, email, hashedPassword) => {
  const [result] = await db.query(
    "INSERT INTO lms.users (fullName, email, password) VALUES (?, ?, ?)",
    [fullName, email, hashedPassword]
  );
  return result;
};

// Find user by ID
exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, fullName, email FROM lms.users WHERE id = ?",
    [id]
  );
  return rows[0];
};

// Save password reset token and expiry
exports.saveResetToken = async (email, token, expiresAt) => {
  const [result] = await db.query(
    "UPDATE lms.users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiresAt, email]
  );
  return result;
};

// Find user by reset token (for reset-password page)
exports.findByResetToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM lms.users WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token]
  );
  return rows[0]; // Return the user only if token is still valid
};

// Update password and clear token fields
exports.updatePassword = async (email, hashedPassword) => {
  const [result] = await db.query(
    "UPDATE lms.users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
    [hashedPassword, email]
  );
  return result;
};
