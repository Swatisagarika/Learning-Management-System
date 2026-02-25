const db = require("../config/db");

// Create Course
exports.createCourse = (data, callback) => {
  const sql = `
    INSERT INTO courses 
    (title, instructor, video_url, thumbnail, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    data.title,
    data.instructor,
    data.videoUrl,
    data.thumbnail,
    data.status,
  ];

  db.query(sql, values, callback);
};

// Get All Courses
exports.getAllCourses = (callback) => {
  const sql = "SELECT * FROM courses";
  db.query(sql, callback);
};
