const Instructor = require('../models/instructorModel');

exports.addInstructor = async (req, res) => {
  try {
    const { instructorName, department, gender, education, mobileNumber, emailAddress, joinDate } = req.body;
    const profilePhoto = req.file ? req.file.filename : null;

    const result = await Instructor.add({
      instructorName,
      department,
      gender,
      education,
      mobileNumber,
      emailAddress,
      joinDate,
      profilePhoto
    });

    res.status(201).json({ message: 'Instructor added successfully', instructorId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.getAll();
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.getById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    const { instructorName, department, gender, education, mobileNumber, emailAddress, joinDate } = req.body;
    const profilePhoto = req.file ? req.file.filename : null;

    await Instructor.update(req.params.id, {
      instructorName,
      department,
      gender,
      education,
      mobileNumber,
      emailAddress,
      joinDate,
      profilePhoto
    });

    res.json({ message: 'Instructor updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    await Instructor.delete(req.params.id);
    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};