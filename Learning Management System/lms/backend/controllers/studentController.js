const {
  getAllStudents,
  insertStudent,
  deleteStudentById,
  updateStudentById,
  getStudentById,
} = require("../models/studentModel");

const fs = require("fs");
const path = require("path");

exports.getStudents = async (req, res) => {
  try {
    const [students] = await getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudent = async (req, res) => {
  const student = req.body;
  student.profilePhoto = req.file ? req.file.filename : null;

  try {
    await insertStudent(student);
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const student = req.body;
  const profilePhoto = req.file ? req.file.filename : null;

  try {
    await updateStudentById(id, student, profilePhoto);
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // First get the student to delete the image from disk
    const [rows] = await getStudentById(id);
    const student = rows[0];

    if (student && student.profilePhoto) {
      const filePath = path.join(__dirname, "..", "uploads", student.profilePhoto);
      fs.unlink(filePath, (err) => {
        if (err) console.log("Error deleting profile image:", err.message);
      });
    }

    await deleteStudentById(id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
