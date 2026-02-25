const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} = require("../controllers/studentController");

//  Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

//  Filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, png, gif, webp) are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

//  Student routes
router.get("/", getStudents); // Get all students
router.post("/", upload.single("profilePhoto"), addStudent); // Add new student
router.put("/:id", upload.single("profilePhoto"), updateStudent); // Update student
router.delete("/:id", deleteStudent); // Delete student

module.exports = router;
