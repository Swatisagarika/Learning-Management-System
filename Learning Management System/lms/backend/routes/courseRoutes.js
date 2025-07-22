const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

//  GET all courses
router.get("/", getAllCourses);

//  POST a new course
router.post("/", addCourse);

//  PUT (update) a course by ID
router.put("/:id", updateCourse);

//  DELETE a course by ID
router.delete("/:id", deleteCourse);

module.exports = router;
