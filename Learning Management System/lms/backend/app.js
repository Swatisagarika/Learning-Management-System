const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON body parser

// Custom Middlewares
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

// Logger Middleware (optional but useful)
app.use(logger);

// Serve uploaded files (e.g., images or profilePhoto)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const authRoutes = require('./routes/auth');
const instructorRoutes = require('./routes/instructorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes'); // ✅ NEW: Course API
const categoryRoutes = require("./routes/categoryRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const eventRoutes = require('./routes/eventRoutes');
const feeRoutes = require("./routes/feeRoutes");


app.use('/api/auth', authRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes); // ✅ NEW: Mount Course Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/holidays", holidayRoutes);
app.use('/api/events', eventRoutes);
app.use("/api/fees", feeRoutes);


// Test Root Route
app.get('/', (req, res) => {
  res.send('📘 LMS Backend Running...');
});

// 404 Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
