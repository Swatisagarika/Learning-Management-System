const Question = require("../models/questionModel");

exports.addQuestion = (req, res) => {
  Question.addQuestion(req.body, err => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Question added successfully"
    });
  });
};
