const db = require("../config/db");

/* =========================
   FIND OTP RECORD
========================= */
exports.findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM lms.forgotpassword WHERE email = ?",
    [email]
  );
  return rows[0];
};


/* =========================
   INSERT OR UPDATE OTP
========================= */
exports.saveOtp = async (email, hashedOtp, expireTime) => {

  const [existing] = await db.query(
    "SELECT * FROM lms.forgotpassword WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {

    // Update existing record
    return db.query(
      `UPDATE lms.forgotpassword 
       SET reset_otp = ?, reset_otp_expire = ?, otp_attempts = 0
       WHERE email = ?`,
      [hashedOtp, expireTime, email]
    );

  } else {

    // Insert new record
    return db.query(
      `INSERT INTO lms.forgotpassword 
       (email, reset_otp, reset_otp_expire, otp_attempts)
       VALUES (?, ?, ?, 0)`,
      [email, hashedOtp, expireTime]
    );
  }
};


/* =========================
   INCREMENT OTP ATTEMPTS
========================= */
exports.incrementAttempts = async (email) => {
  return db.query(
    `UPDATE lms.forgotpassword
     SET otp_attempts = otp_attempts + 1
     WHERE email = ?`,
    [email]
  );
};


/* =========================
   UPDATE PASSWORD IN USERS TABLE
========================= */
exports.updatePassword = async (email, hashedPassword) => {
  return db.query(
    `UPDATE lms.users
     SET password = ?
     WHERE email = ?`,
    [hashedPassword, email]
  );
};


/* =========================
   DELETE OTP RECORD AFTER SUCCESS
========================= */
exports.deleteOtpRecord = async (email) => {
  return db.query(
    "DELETE FROM lms.forgotpassword WHERE email = ?",
    [email]
  );
};
