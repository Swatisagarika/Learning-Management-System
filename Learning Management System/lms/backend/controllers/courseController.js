const Course = require("../models/courseModel");

//  GET all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

//  POST a new course
exports.addCourse = async (req, res) => {
  const { title, instructorName, duration, categoryName } = req.body;

  if (!title || !instructorName || !duration || !categoryName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await Course.addCourse(req.body);
    res.status(201).json({ message: "Course added", courseId: result.insertId });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ error: "Failed to add course" });
  }
};

//  PUT (update) a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, instructorName, duration, categoryName } = req.body;

  if (!title || !instructorName || !duration || !categoryName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await Course.updateCourse(id, req.body);
    res.json({ message: "Course updated" });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};

//  DELETE controller using model
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  console.log(" Backend DELETE ID:", id);

  try {
    const result = await Course.deleteCourse(id);
    console.log(" SQL result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(" Error deleting:", err.message);
    return res.status(500).json({ error: err.message || "Failed to delete course" });
  }
};