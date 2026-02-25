const pool = require("../config/db");

// Get all courses
exports.getAllCourses = async () => {
  const [rows] = await pool.query("SELECT * FROM lms.courses");
  return rows;
};

// Add a new course
exports.addCourse = async (data) => {
  const { title, instructorName, duration, categoryName } = data;
  const [result] = await pool.query(
    "INSERT INTO lms.courses (title, instructorName, duration, categoryName) VALUES (?, ?, ?, ?)",
    [title, instructorName, duration, categoryName]
  );
  return result;
};

// Update course by ID
exports.updateCourse = async (id, data) => {
  const { title, instructorName, duration, categoryName } = data;
  const [result] = await pool.query(
    "UPDATE lms.courses SET title = ?, instructorName = ?, duration = ?, categoryName = ? WHERE id = ?",
    [title, instructorName, duration, categoryName, id]
  );
  return result;
};

//  Delete course by ID
exports.deleteCourse = async (id) => {
  const numericId = Number(id);
  if (isNaN(numericId)) throw new Error("Invalid course ID");

  const [result] = await pool.query(
    "DELETE FROM lms.courses WHERE id = ?",
    [numericId]
  );
  return result; // contains affectedRows
};