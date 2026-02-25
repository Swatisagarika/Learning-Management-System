const db = require("../config/db");

/* Create User */
exports.createUser = (userData, callback) => {
  const { role, fullName, email, password, profileImage } = userData;

  const sql = `
    INSERT INTO lms.users (role, fullName, email, password, profileImage)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [role, fullName, email, password, profileImage],
    callback
  );
};

/* Find User By Email */
exports.findByEmail = (email, callback) => {
  const sql = "SELECT * FROM lms.users WHERE email = ?";
  db.query(sql, [email], callback);
};

/* Find User By ID */
exports.findById = (id, callback) => {
  const sql = "SELECT id, role, fullName, email, profileImage FROM lms.users WHERE id = ?";
  db.query(sql, [id], callback);
};
