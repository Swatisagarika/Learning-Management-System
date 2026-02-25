const Submission = require("../models/submissionModel");

/* QUIZ */
exports.submitQuiz = async (req, res) => {
  try {
    await Submission.submitQuiz(req.body);
    res.json({ message: "Quiz submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizSubmissions = async (req, res) => {
  try {
    const data = await Submission.getQuizSubmissions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ASSIGNMENT */
exports.submitAssignment = async (req, res) => {
  try {
    await Submission.submitAssignment(req.body);
    res.json({ message: "Assignment submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const data = await Submission.getAssignmentSubmissions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
