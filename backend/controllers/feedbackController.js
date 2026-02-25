import * as Feedback from "../models/feedbackModel.js";

export const getFeedbacks = async (req, res) => {
  try {
    const data = await Feedback.getAllFeedbacks();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFeedback = async (req, res) => {
  try {
    await Feedback.addFeedback(req.body);
    res.status(201).json({ message: "Feedback added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editFeedback = async (req, res) => {
  try {
    await Feedback.updateFeedback(req.params.id, req.body);
    res.json({ message: "Feedback updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFeedback = async (req, res) => {
  try {
    await Feedback.deleteFeedback(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
