const attendanceModel = require("../models/attendanceModel");


// SAVE ATTENDANCE
exports.saveAttendance = async (req, res) => {
  try {
    const { studentId, courseId, attendance, rating } = req.body;

    await attendanceModel.saveAttendance(
      studentId,
      courseId,
      attendance,
      rating
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save attendance" });
  }
};


// GET SINGLE STUDENT ATTENDANCE
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const data = await attendanceModel.getStudentAttendance(
      studentId,
      courseId
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching attendance" });
  }
};


// GET COURSE ATTENDANCE
exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;

    const data =
      await attendanceModel.getCourseAttendance(courseId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching attendance" });
  }
};


// GET SUMMARY
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { courseId } = req.params;

    const summary =
      await attendanceModel.getAttendanceSummary(courseId);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Error fetching summary" });
  }
};
