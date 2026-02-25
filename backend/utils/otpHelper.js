const crypto = require("crypto");

// Generate 6 digit OTP
exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP before saving
exports.hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
