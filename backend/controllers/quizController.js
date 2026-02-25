const Assignment = require("../models/assignmentModel");

exports.createAssignment = async (req, res) => {
  try {
    await Assignment.createAssignment(req.body);
    res.status(201).json({ message: "Assignment saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.getAssignments();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
