const db = require("./db");

/* QUIZ SUBMISSION */
exports.submitQuiz = async (data) => {
  const {
    studentName,
    quizId,
    score,
    totalMarks,
    percentage,
    passed,
  } = data;

  await db.execute(
    `INSERT INTO lms.quiz_submissions
     (student_name, quiz_id, score, total_marks, percentage, passed)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [studentName, quizId, score, totalMarks, percentage, passed]
  );
};

exports.getQuizSubmissions = async () => {
  const [rows] = await db.execute(`SELECT * FROM lms.quiz_submissions`);
  return rows;
};

/* ASSIGNMENT SUBMISSION */
exports.submitAssignment = async (data) => {
  const { studentName, assignmentId, fileName } = data;

  await db.execute(
    `INSERT INTO lms.assignment_submissions
     (student_name, assignment_id, file_name)
     VALUES (?, ?, ?)`,
    [studentName, assignmentId, fileName]
  );
};

exports.getAssignmentSubmissions = async () => {
  const [rows] = await db.execute(`SELECT * FROM lms.assignment_submissions`);
  return rows;
};
