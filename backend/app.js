const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Custom Middleware
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

// ✅ Logger Middleware (optional for debugging)
app.use(logger);

// ✅ Serve uploaded files (e.g., profile photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes Import
const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const eventRoutes = require('./routes/eventRoutes');
const feeRoutes = require('./routes/feeRoutes');
const instCourseRoutes = require("./routes/instCourseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const forgotRoutes = require("./routes/forgotRoutes");
const settingsRoutes = require("./routes/settingsRoutes.js");
import feedbackRoutes from "./routes/feedbackRoutes.js";

// ✅ Mount Routes with base paths
app.use('/api/auth/register', authRoutes);            // includes /update/:id
app.use('/api/instructors', instructorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/fees', feeRoutes);
app.use("/api/instructor/courses", instCourseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/forgotpassword", forgotRoutes);
app.use("/api/settings", settingsRoutes);



//  Root route for server check
app.get('/', (req, res) => {
  res.send(' LMS Backend Running...');
});

//  Error Handling Middlewares
app.use(notFound);        // 404 handler
app.use(errorHandler);    // Global error handler

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
