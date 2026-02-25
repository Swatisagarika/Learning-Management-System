const Course = require("../models/instCourseModel");

// CREATE COURSE
exports.createCourse = (req, res) => {
  const { title, instructor, videoUrl, thumbnail, status } = req.body;

  if (!title || !instructor) {
    return res.status(400).json({
      message: "Title and Instructor are required",
    });
  }

  const courseData = {
    title,
    instructor,
    videoUrl,
    thumbnail,
    status: status || "Draft",
  };

  Course.createCourse(courseData, (err, result) => {
    if (err) {
      console.error("Create course error:", err);
      return res.status(500).json({
        message: "Failed to create course",
      });
    }

    res.status(201).json({
      message: "Course created successfully",
      courseId: result.insertId,
    });
  });
};

// GET ALL COURSES
exports.getCourses = (req, res) => {
  Course.getAllCourses((err, courses) => {
    if (err) {
      console.error("Fetch courses error:", err);
      return res.status(500).json({
        message: "Failed to fetch courses",
      });
    }

    res.status(200).json(courses);
  });
};
