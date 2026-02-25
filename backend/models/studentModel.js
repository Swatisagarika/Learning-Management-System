const db = require("../config/db");

// Get all students
exports.getAllStudents = async () => {
  const [rows] = await db.query("SELECT * FROM lms.students");
  return [rows];
};

// Insert a new student
exports.insertStudent = async (student) => {
  const {
    studentName,
    rollNo,
    className,
    gender,
    dob,
    email,
    mobile,
    address,
    profilePhoto,
  } = student;

  const sql = `
    INSERT INTO lms.students 
    (studentName, rollNo, className, gender, dob, email, mobile, address, profilePhoto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    studentName,
    rollNo,
    className,
    gender,
    dob,
    email,
    mobile,
    address,
    profilePhoto,
  ]);
  return result;
};

// Get a student by ID (used for image deletion)
exports.getStudentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM lms.students WHERE id = ?", [id]);
  return [rows];
};

// Delete student by ID
exports.deleteStudentById = async (id) => {
  const [result] = await db.query("DELETE FROM lms.students WHERE id = ?", [id]);
  return result;
};

// Update student by ID
exports.updateStudentById = async (id, student, profilePhoto) => {
  const {
    studentName,
    rollNo,
    className,
    gender,
    dob,
    email,
    mobile,
    address,
  } = student;

  let sql = `
    UPDATE lms.students
    SET studentName = ?, rollNo = ?, className = ?, gender = ?, dob = ?, email = ?, mobile = ?, address = ?
  `;
  const values = [
    studentName,
    rollNo,
    className,
    gender,
    dob,
    email,
    mobile,
    address,
  ];

  if (profilePhoto) {
    sql += `, profilePhoto = ?`;
    values.push(profilePhoto);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  const [result] = await db.query(sql, values);
  return result;
};
