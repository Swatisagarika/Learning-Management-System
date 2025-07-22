const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const pool = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // serve uploaded images

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


// Register a user
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existingUser] = await pool.query("SELECT * FROM lms.users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO lms.users (fullName, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully", id: result.insertId });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login a user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const [users] = await pool.query("SELECT * FROM lms.users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, users[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: users[0].id, email: users[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: users[0].id,
        fullName: users[0].fullName,
        email: users[0].email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [users] = await pool.query("SELECT * FROM lms.users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      "UPDATE lms.users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiresAt, email]
    );

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"LMS Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Password reset link sent to your email." });

  } catch (err) {
    console.error("Forgot Password error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// GET - All instructors
app.get("/api/instructors", async (req, res) => {
  try {
    const [results] = await pool.query(`SELECT id, instructorName, department, gender, education, mobileNumber, emailAddress, DATE_FORMAT(joinDate, '%Y-%m-%d') AS joinDate, profilePhoto FROM lms.instructors`);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Single instructor by ID
app.get("/api/instructors/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("SELECT * FROM lms.instructors WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add instructor
app.post("/api/instructors", upload.single("profilePhoto"), async (req, res) => {
  const {
    instructorName,
    department,
    gender,
    education,
    mobileNumber,
    emailAddress,
    joinDate,
  } = req.body;

  const profilePhoto = req.file ? req.file.filename : null;

  if (
    !instructorName ||
    !department ||
    !gender ||
    !education ||
    !mobileNumber ||
    !emailAddress ||
    !joinDate ||
    !profilePhoto
  ) {
    return res.status(400).json({ message: "All fields including profile photo are required" });
  }

  const sql = `
    INSERT INTO lms.instructors 
    (instructorName, department, gender, education, mobileNumber, emailAddress, joinDate, profilePhoto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await pool.query(sql, [
      instructorName,
      department,
      gender,
      education,
      mobileNumber,
      emailAddress,
      joinDate,
      profilePhoto,
    ]);
    res.status(201).json({ message: "Instructor added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update instructor (with optional new photo upload)
app.put("/api/instructors/:id", upload.single("profilePhoto"), async (req, res) => {
  const id = req.params.id;

  const {
    instructorName,
    department,
    gender,
    education,
    mobileNumber,
    emailAddress,
    joinDate,
    existingPhoto,
  } = req.body;

  // Use new uploaded photo if available, else use existing
  const profilePhoto = req.file ? req.file.filename : existingPhoto;

  // Convert joinDate to YYYY-MM-DD (MySQL DATE format)
  const formattedDate = joinDate?.split("T")[0]; // handles ISO string like "2025-07-15T18:30:00.000Z"

  // Validation
  if (
    !instructorName?.trim() ||
    !department?.trim() ||
    !gender?.trim() ||
    !education?.trim() ||
    !mobileNumber?.trim() ||
    !emailAddress?.trim() ||
    !formattedDate
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    UPDATE lms.instructors SET 
      instructorName = ?, 
      department = ?, 
      gender = ?, 
      education = ?, 
      mobileNumber = ?, 
      emailAddress = ?, 
      joinDate = ?, 
      profilePhoto = ?
    WHERE id = ?`;

  try {
    const [result] = await pool.query(sql, [
      instructorName,
      department,
      gender,
      education,
      mobileNumber,
      emailAddress,
      formattedDate,
      profilePhoto,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Instructor not found." });
    }

    // Fetch and return updated record
    const [updatedRows] = await pool.query("SELECT * FROM lms.instructors WHERE id = ?", [id]);
    res.status(200).json(updatedRows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// DELETE - Instructor
app.delete("/api/instructors/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM lms.instructors WHERE id = ?", [id]);
    res.json({ message: "Instructor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - All Students
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, studentName, rollNo, className, gender, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, email, mobile, address, profilePhoto FROM lms.students`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  POST a new student
app.post("/api/students", upload.single("profilePhoto"), async (req, res) => {
  const { studentName, rollNo, className, gender, dob, email, mobile, address } = req.body;
  const profilePhoto = req.file ? req.file.filename : null;
  try {
    const sql = `
      INSERT INTO lms.students 
      (studentName, rollNo, className, gender, dob, email, mobile, address, profilePhoto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [studentName, rollNo, className, gender, dob, email, mobile, address, profilePhoto]);
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update Student
app.put("/api/students/:id", upload.single("profilePhoto"), async (req, res) => {
  const { id } = req.params;
  const { studentName, rollNo, className, gender, dob, email, mobile, address } = req.body;
  const profilePhoto = req.file ? req.file.filestudentName : null;
  try {
    let sql = `
      UPDATE lms.students
      SET studentName=?, rollNo=?, className=?, gender=?, dob=?, email=?, mobile=?, address=?
    `;
    const values = [studentName, rollNo, className, gender, dob, email, mobile, address];
    if (profilePhoto) {
      sql += `, profilePhoto=?`;
      values.push(profilePhoto);
    }
    sql += ` WHERE id=?`;
    values.push(id);
    await pool.query(sql, values);
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete Student + Image
app.delete("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT profilePhoto FROM lms.students WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
    const student = rows[0];
    await pool.query("DELETE FROM lms.students WHERE id = ?", [id]);
    if (student.profilePhoto) {
      const filePath = path.join(__dirname, "uploads", student.profilePhoto);
      fs.unlink(filePath, (err) => {
        if (err) console.warn(" Failed to delete image:", err.message);
      });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(" Error deleting student:", error.message);
    res.status(500).json({ message: "Server error while deleting student" });
  }
});

// GET: Check Unique Roll No
app.get("/api/students/check-rollno", async (req, res) => {
  const { rollNo, excludeId } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT id FROM lms.students WHERE rollNo = ? ${excludeId ? "AND id != ?" : ""}`,
      excludeId ? [rollNo, excludeId] : [rollNo]
    );
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: "Error checking rollNo" });
  }
});

// ✅ Total students count
app.get("/api/students/total", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM lms.students");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ New students joined in last 30 days
app.get("/api/students/new", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT COUNT(*) AS newCount
      FROM lms.students
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    res.json({ newCount: rows[0].newCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET: Check Unique Email
app.get("/api/students/check-email", async (req, res) => {
  const { email, excludeId } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT id FROM lms.students WHERE email = ? ${excludeId ? "AND id != ?" : ""}`,
      excludeId ? [email, excludeId] : [email]
    );
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: "Error checking email" });
  }
}); 

//  GET all courses
app.get("/api/courses", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM lms.courses");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  POST a new course
app.post("/api/courses", async (req, res) => {
  const { title, instructorName, duration, categoryName } = req.body;
  if (!title || !instructorName || !duration || !categoryName) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = `
    INSERT INTO lms.courses (title, instructorName, duration, categoryName)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.query(query, [title, instructorName, duration, categoryName]);
    res.status(201).json({ message: "Course added", courseId: result.insertId });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ error: "Failed to add course" });
  }
});

//  PUT (update) a course by ID
app.put("/api/courses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, instructorName, duration, categoryName } = req.body;
  if (!title || !instructorName || !duration || !categoryName) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = `
    UPDATE lms.courses
    SET title = ?, instructorName = ?, duration = ?, categoryName = ?
    WHERE id = ?
  `;
  try {
    await pool.query(query, [title, instructorName, duration, categoryName, id]);
    res.json({ message: "Course updated" });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
});

//  DELETE a course by ID
app.delete("/api/courses/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid course ID" });
  }
  const query = "DELETE FROM lms.courses WHERE id = ?";
  try {
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    //  Ensure this always sends JSON
    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    return res.status(500).json({ error: "Failed to delete course" });
  }
});

// ✅ Route: Get total number of courses
app.get("/api/courses/total", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM lms.courses");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Error fetching course count:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  GET all course categories
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lms.categories");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

//  POST a new course category
app.post("/api/categories", async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const [result] = await pool.query("INSERT INTO lms.categories (categoryName) VALUES (?)", [categoryName]);
    res.status(201).json({ id: result.insertId, categoryName });
  } catch (error) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

//  DELETE a course category by ID
app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM lms.categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

//  GET all holidays
app.get("/api/holidays", async (req, res) => {
  try {
    const [results] = await pool.query(`SELECT id, name, date_format(date, '%Y-%m-%d') as date, description FROM lms.holidays`);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  POST a new holiday
app.post("/api/holidays", async (req, res) => {
  const { name, date, description } = req.body;
  try {
    await pool.query(
      "INSERT INTO lms.holidays (name, date, description) VALUES (?, ?, ?)",
      [name, date, description]
    );
    res.json({ message: "Holiday added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  PUT (update) an existing holiday
app.put("/api/holidays/:id", async (req, res) => {
  const { id } = req.params;
  let { name, date, description } = req.body;

  // ⬅️ Convert ISO date to YYYY-MM-DD
  try {
    date = new Date(date).toISOString().split("T")[0]; // --> "2025-07-19"

    const [result] = await pool.query(
      "UPDATE lms.holidays SET name = ?, date = ?, description = ? WHERE id = ?",
      [name, date, description, id]
    );
    res.json({ message: "Holiday updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  DELETE a holiday
app.delete("/api/holidays/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM lms.holidays WHERE id = ?", [id]);
    res.json({ message: "Holiday deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 GET all events
app.get("/api/events", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT id, title, time, color, date_format(date, '%Y-%m-%d') as date FROM lms.events");
    res.json(results);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 🔹 POST - Add new event
app.post("/api/events", async (req, res) => {
  const { title, time, color, date } = req.body;
  if (!title || !time || !color || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO lms.events (title, time, color, date) VALUES (?, ?, ?, ?)",
      [title, time, color, date]
    );
    res.json({ message: "Event added", id: result.insertId });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Failed to add event" });
  }
});

// 🔹 PUT - Update existing event
app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  const { title, time, color, date } = req.body;
  if (!title || !time || !color || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await pool.query(
      "UPDATE lms.events SET title = ?, time = ?, color = ?, date = ? WHERE id = ?",
      [title, time, color, date, id]
    );
    res.json({ message: "Event updated" });
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// 🔹 DELETE - Remove event
app.delete("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM lms.events WHERE id = ?", [id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// GET all fees
app.get("/api/fees", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, rollNo, studentName, fees_type, payment_type, status, date_format(date, '%Y-%m-%d') as date, amount FROM lms.fees`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add fee record
app.post("/api/fees", async (req, res) => {
  const { rollNo, studentName, fees_type, payment_type, status, date, amount } = req.body;
  try {
    const sql = `
      INSERT INTO lms.fees (rollNo, studentName, fees_type, payment_type, status, date, amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [rollNo, studentName, fees_type, payment_type, status, date, amount]);
    res.status(201).json({ message: "Fee record added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/fees/:id", async (req, res) => {
  const { id } = req.params;
  const { rollNo, studentName, fees_type, payment_type, status, date, amount } = req.body;

  try {
    const rawDate = date instanceof Date ? date : new Date(date);
    const formattedDate = rawDate.toISOString().split("T")[0]; // ➜ 'YYYY-MM-DD'

    const sql = `
      UPDATE lms.fees
      SET rollNo=?, studentName=?, fees_type=?, payment_type=?, status=?, date=?, amount=?
      WHERE id=?
    `;
    await pool.query(sql, [rollNo, studentName, fees_type, payment_type, status, formattedDate, amount, id]);
    res.json({ message: "Fee record updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete fee record
app.delete("/api/fees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM lms.fees WHERE id = ?", [id]);
    res.json({ message: "Fee record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get total fees collected
app.get("/api/fees/total", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT SUM(amount) AS totalAmount FROM lms.fees WHERE status = 'Paid'");
    res.json({ totalAmount: rows[0].totalAmount || 0 });
  } catch (error) {
    console.error("Error fetching total fees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
