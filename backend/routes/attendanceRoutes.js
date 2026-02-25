const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");

router.post("/save", attendanceController.saveAttendance);

router.get("/:studentId/:courseId",
  attendanceController.getStudentAttendance
);

router.get("/course/:courseId",
  attendanceController.getCourseAttendance
);

router.get("/summary/:courseId",
  attendanceController.getAttendanceSummary
);

module.exports = router;
