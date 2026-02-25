// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const pool = require("./config/db");
const nodemailer = require("nodemailer");


const { generateOtp, hashOtp } = require("./utils/otpHelper"); // ✅ ADD THIS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =============================
// Middlewares
// =============================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded images

// =============================
// Multer setup for file upload
// =============================
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

/* =============================
   REGISTER USER
============================= */
app.post(
  "/api/auth/register",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      let { role, fullName, email, password } = req.body;

      role = role?.trim();
      fullName = fullName?.trim();
      email = email?.trim().toLowerCase();

      const profileImage = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      if (!role || !fullName || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const allowedRoles = ["Admin", "Instructor", "Student"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role selected",
        });
      }

      const [existingUser] = await pool.query(
        "SELECT id FROM lms.users WHERE email = ? LIMIT 1",
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        `INSERT INTO lms.users
         (role, fullName, email, password, profileImage)
         VALUES (?, ?, ?, ?, ?)`,
        [role, fullName, email, hashedPassword, profileImage]
      );

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: result.insertId,
          role,
          fullName,
          email,
          profileImage,
        },
      });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

/* =============================
   LOGIN USER
============================= */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by EMAIL
    const [users] = await pool.query(
      "SELECT * FROM lms.users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage, // ✅ correct column
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});


// =============================
// Get user by ID (Settings page)
// =============================
app.get("/api/auth/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await pool.query(
      "SELECT id, fullName, email, role, profileImage FROM lms.users WHERE id = ?",
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// Update user profile (Settings page)
// =============================
app.put("/api/auth/user/:id", upload.single("profileImage"), async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "UPDATE lms.users SET fullName = ?, email = ?, password = ?, profileImage = ? WHERE id = ?",
      [fullName, email, hashedPassword, profileImage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or not updated" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   SEND OTP
================================ */
app.post("/api/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // ✅ Check if user exists
    const [users] = await pool.query(
      "SELECT id FROM lms.users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ Check existing OTP request
    const [existing] = await pool.query(
      "SELECT id FROM lms.forgotpassword WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE lms.forgotpassword 
         SET reset_otp = ?, reset_otp_expire = ?, otp_attempts = 0
         WHERE email = ?`,
        [hashedOtp, expireTime, email]
      );
    } else {
      await pool.query(
        `INSERT INTO lms.forgotpassword 
         (email, reset_otp, reset_otp_expire, otp_attempts)
         VALUES (?, ?, ?, 0)`,
        [email, hashedOtp, expireTime]
      );
    }

    /* ✅ Send Email */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===============================
   RESET PASSWORD
================================ */
app.post("/api/forgotpassword/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM lms.forgotpassword WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const request = rows[0];

    // ✅ Check OTP expiry
    if (new Date(request.reset_otp_expire) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Limit attempts
    if (request.otp_attempts >= 5) {
      return res.status(403).json({ message: "Too many attempts" });
    }

    const hashedOtp = hashOtp(otp);

    if (hashedOtp !== request.reset_otp) {
      await pool.query(
        `UPDATE lms.forgotpassword 
         SET otp_attempts = otp_attempts + 1
         WHERE email = ?`,
        [email]
      );

      return res.status(400).json({ message: "Invalid OTP" });
    }

    /* ✅ Hash new password */
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE lms.users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    /* ✅ Delete OTP record after success */
    await pool.query(
      "DELETE FROM lms.forgotpassword WHERE email = ?",
      [email]
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user settings
app.get("/api/settings", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // 🔥 DISABLE CACHE
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const [rows] = await pool.query(
      `SELECT 
        id,
        role,
        fullName,
        email,
        profileImage,
        themeMode,
        notifications_enabled
       FROM lms.users
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// POST user settings
app.post(
  "/api/settings",
  upload.single("profileImage"),
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        userId,
        fullName,
        email,
        themeMode,
        notifications_enabled,
      } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      // Handle image
      let profileImage = null;
      if (req.file) {
        profileImage = `/uploads/${req.file.filename}`;
      }

      const notifications =
        notifications_enabled === true ||
          notifications_enabled === "true" ||
          notifications_enabled === "1"
          ? 1
          : 0;

      // ✅ UPDATE
      await connection.query(
        `UPDATE lms.users SET
    fullName = COALESCE(?, fullName),
    email = COALESCE(?, email),
    profileImage = COALESCE(?, profileImage),
    themeMode = COALESCE(?, themeMode),
    notifications_enabled = ?
   WHERE id = ?`,
        [
          fullName || null,
          email || null,
          profileImage || null,
          themeMode || null,
          notifications,
          userId,
        ]
      );

      // ✅ COMMIT FIRST
      await connection.commit();

      // ✅ SELECT FROM SAME CONNECTION
      const [rows] = await connection.query(
        `SELECT 
          id,
          role,
          fullName,
          email,
          profileImage,
          themeMode,
          notifications_enabled
         FROM lms.users
         WHERE id = ?`,
        [userId]
      );

      res.status(200).json(rows[0]);
    } catch (error) {
      await connection.rollback();
      console.error("POST /api/settings error:", error);
      res.status(500).json({ message: "Failed to update settings" });
    } finally {
      connection.release();
    }
  }
);

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

//  Total students count
app.get("/api/students/total", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM lms.students");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  New students joined in last 30 days
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

//  Route: Get total number of courses
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

  //  Convert ISO date to YYYY-MM-DD
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

//  GET all events
app.get("/api/events", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT id, title, time, color, date_format(date, '%Y-%m-%d') as date FROM lms.events");
    res.json(results);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

//  POST - Add new event
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

//  PUT - Update existing event
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

//  DELETE - Remove event
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

//  PUT - Update existing fees record
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

//  Get total fees collected
app.get("/api/fees/total", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT SUM(amount) AS totalAmount FROM lms.fees WHERE status = 'Paid'");
    res.json({ totalAmount: rows[0].totalAmount || 0 });
  } catch (error) {
    console.error("Error fetching total fees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==============================
// GET all instructor courses
// ==============================
app.get("/api/instructor/courses", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        title,
        instructor,
        video_url AS videoUrl,
        thumbnail,
        status
      FROM lms.instcourse
    `);

    res.status(200).json(rows); // MUST be an array
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({
      error: "Failed to fetch courses",
      details: err.message,
    });
  }
});


// ==============================
// POST - Create new course
// ==============================
app.post("/api/instructor/courses", async (req, res) => {
  const { title, instructor, videoUrl, thumbnail, status } = req.body;

  if (!title || !instructor) {
    return res.status(400).json({
      error: "Title and Instructor are required",
    });
  }

  try {
    const sql = `
      INSERT INTO lms.instcourse 
      (title, instructor, video_url, thumbnail, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      title,
      instructor,
      videoUrl,
      thumbnail,
      status || "Draft",
    ]);

    res.status(201).json({
      message: "Course created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/instructor/courses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, instructor, videoUrl, thumbnail, status } = req.body;

  // Basic validation
  if (!title || !instructor) {
    return res.status(400).json({ error: "Title and Instructor are required" });
  }

  try {
    const sql = `
      UPDATE lms.instcourse 
      SET title = ?, instructor = ?, video_url = ?, thumbnail = ?, status = ?
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [
      title,
      instructor,
      videoUrl || null,
      thumbnail || null,
      status || "Draft",
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE course by id
app.delete("/api/instructor/courses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM lms.instcourse WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/lessons", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lms.lessons");
    res.json(rows);
  } catch (err) {
    console.error("GET LESSONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET all lessons
app.get("/api/lessons", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        type,
        file AS fileUrl,
        externalLink,
        mandatory,
        allowDownload,
        status
      FROM lms.lessons
    `);

    res.json({ data: rows });
  } catch (err) {
    console.error("GET LESSONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST - Add lesson
app.post("/api/lessons", upload.single("file"), async (req, res) => {
  try {
    //  Universal sanitizer
    const clean = (v) =>
      Array.isArray(v) ? String(v[0]).trim() : String(v ?? "").trim();

    const title = clean(req.body.title);
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const type = clean(req.body.type);
    const externalLink = clean(req.body.externalLink) || null;

    const mandatory =
      req.body.mandatory === "true" || req.body.mandatory === true;

    const allowDownload =
      req.body.allowDownload === "true" || req.body.allowDownload === true;

    const status = clean(req.body.status) || "Draft";

    // File handling (never auto-remove)
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO lms.lessons
      (title, type, file, externalLink, mandatory, allowDownload, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      title,
      type,
      filePath,
      externalLink,
      mandatory,
      allowDownload,
      status,
    ]);

    res.status(201).json({
      id: result.insertId,
      title,
      type,
      file: filePath,
      externalLink,
      mandatory,
      allowDownload,
      status,
    });
  } catch (err) {
    console.error("ADD LESSON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update lesson
app.put("/api/lessons/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;

  try {
    //  Universal sanitizer (prevents react0, arrays, undefined)
    const clean = (v) =>
      Array.isArray(v) ? String(v[0]).trim() : String(v ?? "").trim();

    const title = clean(req.body.title);
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const type = clean(req.body.type);
    const externalLink = clean(req.body.externalLink) || null;

    const mandatory =
      req.body.mandatory === "true" || req.body.mandatory === true;

    const allowDownload =
      req.body.allowDownload === "true" || req.body.allowDownload === true;

    const status = clean(req.body.status) || "Draft";

    // Only overwrite file if a NEW file is uploaded
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      UPDATE lms.lessons
      SET
        title = ?,
        type = ?,
        externalLink = ?,
        mandatory = ?,
        allowDownload = ?,
        status = ?,
        file = IFNULL(?, file)
      WHERE id = ?
    `;

    await pool.query(sql, [
      title,
      type,
      externalLink,
      mandatory,
      allowDownload,
      status,
      filePath,
      id,
    ]);

    res.json({
      id,
      title,
      type,
      externalLink,
      mandatory,
      allowDownload,
      status,
      ...(filePath && { file: filePath }), // don't overwrite on frontend
    });
  } catch (err) {
    console.error("UPDATE LESSON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete lesson
app.delete("/api/lessons/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM lms.lessons WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    console.error("DELETE LESSON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET all quizzes
app.get("/api/quizzes", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, course, time_limit, passing_marks, total_marks
       FROM quizzes`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});


// GET quiz by ID with questions
app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const [[quiz]] = await pool.query(
      "SELECT * FROM quizzes WHERE id = ?",
      [id]
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const [questions] = await pool.query(
      "SELECT * FROM questions WHERE quiz_id = ?",
      [id]
    );

    quiz.questions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options ? JSON.parse(q.options) : [],
      correctAnswer: q.correct_answer,
      marks: q.marks,
    }));

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
});

//POST create quiz
app.post("/api/quizzes", async (req, res) => {
  console.log("REQ BODY:", req.body);

  let conn;
  try {
    const { quizInfo, questions } = req.body;

    // ✅ validation
    if (
      !quizInfo ||
      !quizInfo.title ||
      !quizInfo.course ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({ message: "Invalid quiz data" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // ✅ calculate total marks
    const totalMarks = questions.reduce(
      (sum, q) => sum + Number(q.marks || 0),
      0
    );

    // ✅ insert quiz
    const [quizResult] = await conn.query(
      `INSERT INTO quizzes
       (title, course, time_limit, passing_marks, total_marks)
       VALUES (?, ?, ?, ?, ?)`,
      [
        quizInfo.title,
        quizInfo.course,
        quizInfo.timeLimit,
        quizInfo.passingMarks,
        totalMarks,
      ]
    );

    const quizId = quizResult.insertId;

    // ✅ insert questions (FIXED TABLE NAME)
    for (const q of questions) {
      await conn.query(
        `INSERT INTO questions
         (quiz_id, question, options, correct_answer, marks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          quizId,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.marks,
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: "Quiz saved successfully",
      quizId,
    });
  } catch (err) {
    if (conn) await conn.rollback();

    console.error("QUIZ SAVE ERROR:", err);

    res.status(500).json({
      message: "Quiz save failed",
      error: err.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

//PUT update quiz
app.put("/quiz/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, course, time_limit, passing_marks } = req.body;

    await pool.query(
      `UPDATE lms.quizzes 
       SET title=?, course=?, time_limit=?, passing_marks=?
       WHERE id=?`,
      [title, course, time_limit, passing_marks, id]
    );

    res.json({ message: "Quiz updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE quiz
app.delete("/api/quizzes/:id", async (req, res) => {
  let conn;
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.query(
      "DELETE FROM quizzes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Quiz not found" });
    }

    await conn.commit();
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to delete quiz" });
  } finally {
    if (conn) conn.release();
  }
});



//GET assignment
app.get("/assignment", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lms.assignments");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//POST assignment
app.post("/assignment", async (req, res) => {
  try {
    const { title, description, due_date, file_name, status } = req.body;

    await pool.query(
      `INSERT INTO lms.assignments 
       (title, description, due_date, file_name, status)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, due_date, file_name, status]
    );

    res.status(201).json({ message: "Assignment created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT update assignment
app.put("/assignment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, status } = req.body;

    await pool.query(
      `UPDATE lms.assignments 
       SET title=?, description=?, due_date=?, status=?
       WHERE id=?`,
      [title, description, due_date, status, id]
    );

    res.json({ message: "Assignment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//DELETE assignment
app.delete("/assignment/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM lms.assignments WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Submission (GET Only)
app.get("/submissions/quiz", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lms.quiz_submissions");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/submissions/assignment", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lms.assignment_submissions");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ====================================
   POST -> SAVE / UPDATE ATTENDANCE
==================================== */
app.post("/api/attendance", async (req, res) => {
  try {
    const { student_id, course_id, attendance = 0, rating = 0 } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({
        error: "student_id and course_id are required",
      });
    }

    const sql = `
      INSERT INTO attendance (student_id, course_id, attendance, rating)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        attendance = VALUES(attendance),
        rating = VALUES(rating),
        updated_at = CURRENT_TIMESTAMP
    `;

    await pool.query(sql, [
      student_id,
      course_id,
      attendance,
      rating,
    ]);

    res.json({
      success: true,
      message: "Attendance saved successfully",
    });
  } catch (err) {
    console.error("SAVE ATTENDANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ====================================
   GET -> FETCH ATTENDANCE BY COURSE
==================================== */
app.get("/api/attendance/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const sql = `
      SELECT
        a.student_id,
        a.course_id,
        a.attendance,
        a.rating,
        a.updated_at,
        s.studentName AS student_name
      FROM attendance a
      JOIN students s ON s.id = a.student_id
      WHERE a.course_id = ?
      ORDER BY s.studentName
    `;

    const [rows] = await pool.query(sql, [courseId]);

    res.json(rows);
  } catch (err) {
    console.error("GET COURSE ATTENDANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ====================================
   GET -> FETCH SINGLE STUDENT ATTENDANCE
==================================== */
app.get("/api/attendance/:courseId/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const sql = `
      SELECT
        student_id,
        course_id,
        attendance,
        rating,
        updated_at
      FROM attendance
      WHERE course_id = ? AND student_id = ?
    `;

    const [rows] = await pool.query(sql, [courseId, studentId]);

    res.json(rows[0] || {});
  } catch (err) {
    console.error("GET STUDENT ATTENDANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL FEEDBACKS
========================= */
// GET FEEDBACKS
app.get("/api/feedbacks", async (req, res) => {
  try {
    const [results] = await pool.query(`SELECT id,name, email, course, rating, comment, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM lms.feedbacks`);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

// ADD FEEDBACK
app.post("/api/feedbacks", async (req, res) => {
  const { name, email, course, rating, comment, date } = req.body;

  if (!name || !email || !course || !rating || !comment || !date) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO lms.feedbacks (name, email, course, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, course, rating, comment, date]
    );

    res.status(201).json({ message: "Feedback added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Insert failed" });
  }
});

// UPDATE FEEDBACK
app.put("/api/feedbacks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, course, rating, comment, date } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE lms.feedbacks SET name=?, email=?, course=?, rating=?, comment=?, date=? WHERE id=?",
      [name, email, course, rating, comment, date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE FEEDBACK
app.delete("/api/feedbacks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM lms.feedbacks WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


