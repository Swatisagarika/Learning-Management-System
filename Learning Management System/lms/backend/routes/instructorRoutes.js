const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  addInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
} = require('../controllers/instructorController');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store in /uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

// Routes

// GET all instructors
router.get('/', getAllInstructors);

// GET instructor by ID
router.get('/:id', getInstructorById);

// POST add new instructor
// ⚠️ Make sure the key 'profilePhoto' matches frontend: formData.append("profilePhoto", ...)
router.post('/add', upload.single('profilePhoto'), addInstructor);

// PUT update instructor
router.put('/:id', upload.single('profilePhoto'), updateInstructor);

// DELETE instructor
router.delete('/:id', deleteInstructor);

module.exports = router;
