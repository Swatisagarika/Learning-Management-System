const db = require("../config/db");


// SAVE OR UPDATE ATTENDANCE
exports.saveAttendance = async (
  studentId,
  courseId,
  attendance,
  rating = 0
) => {
  const query = `
    INSERT INTO lms.attendance
    (student_id, course_id, attendance, rating)
    VALUES (?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE
    attendance = VALUES(attendance),
    rating = VALUES(rating),
    updated_at = CURRENT_TIMESTAMP
  `;

  const [result] = await db.query(query, [
    studentId,
    courseId,
    attendance,
    rating,
  ]);

  return result;
};


// GET SINGLE STUDENT ATTENDANCE
exports.getStudentAttendance = async (studentId, courseId) => {
  const [rows] = await db.query(
    `SELECT * FROM attendance
     WHERE student_id = ? AND course_id = ?`,
    [studentId, courseId]
  );

  return rows[0];
};


// GET ALL STUDENTS ATTENDANCE FOR COURSE
exports.getCourseAttendance = async (courseId) => {
  const [rows] = await db.query(
    `SELECT s.id, s.studentName, a.attendance, a.rating
     FROM attendance a
     JOIN students s ON a.student_id = s.id
     WHERE a.course_id = ?`,
    [courseId]
  );

  return rows;
};


// GET COURSE SUMMARY
exports.getAttendanceSummary = async (courseId) => {
  const [rows] = await db.query(
    `
    SELECT
      COUNT(*) AS totalStudents,
      SUM(CASE WHEN attendance >= 80 THEN 1 ELSE 0 END) AS present,
      SUM(CASE WHEN attendance < 20 THEN 1 ELSE 0 END) AS absent
    FROM attendance
    WHERE course_id = ?
    `,
    [courseId]
  );

  return rows[0];
};
