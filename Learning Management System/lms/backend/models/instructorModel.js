const db = require('../config/db');

const Instructor = {
  add: async ({ instructorName, department, gender, education, mobileNumber, emailAddress, joinDate, profilePhoto }) => {
    const [result] = await db.execute(
      `INSERT INTO lms.instructors 
      (instructorName, department, gender, education, mobileNumber, emailAddress, joinDate, profilePhoto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [instructorName, department, gender, education, mobileNumber, emailAddress, joinDate, profilePhoto]
    );
    return result;
  },

  getAll: async () => {
    const [rows] = await db.execute(`SELECT * FROM lms.instructors ORDER BY id DESC`);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(`SELECT * FROM lms.instructors WHERE id = ?`, [id]);
    return rows[0];
  },

  update: async (id, { instructorName, department, gender, education, mobileNumber, emailAddress, joinDate, profilePhoto }) => {
    const [result] = await db.execute(
      `UPDATE lms.instructors SET 
        instructorName = ?, department = ?, gender = ?, education = ?, 
        mobileNumber = ?, emailAddress = ?, joinDate = ?, profilePhoto = ?
      WHERE id = ?`,
      [instructorName, department, gender, education, mobileNumber, emailAddress, joinDate, profilePhoto, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute(`DELETE FROM lms.instructors WHERE id = ?`, [id]);
    return result;
  }
};

module.exports = Instructor;
