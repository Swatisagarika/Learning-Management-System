const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
} = require("../controllers/instCourseController");

// Create new course
router.post("/create", createCourse);

// Get all courses
router.get("/list", getCourses);

module.exports = router;
