const db = require("./db");

exports.createQuiz = async (quizInfo, totalMarks) => {
  const [result] = await db.execute(
    `INSERT INTO lms.quizzes (title, course, time_limit, passing_marks, total_marks)
     VALUES (?, ?, ?, ?, ?)`,
    [
      quizInfo.title,
      quizInfo.course,
      quizInfo.timeLimit,
      quizInfo.passingMarks,
      totalMarks,
    ]
  );
  return result.insertId;
};

exports.createQuestion = async (quizId, q) => {
  await db.execute(
    `INSERT INTO lms.questions (quiz_id, question, options, correct_answer, marks)
     VALUES (?, ?, ?, ?, ?)`,
    [quizId, q.question, JSON.stringify(q.options), q.correctAnswer, q.marks]
  );
};

exports.getAllQuizzes = async () => {
  const [rows] = await db.execute(`SELECT * FROM lms.quizzes`);
  return rows;
};
