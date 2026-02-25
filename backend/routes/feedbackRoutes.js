import express from "express";
import {
  getFeedbacks,
  createFeedback,
  editFeedback,
  removeFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/", getFeedbacks);
router.post("/", createFeedback);
router.put("/:id", editFeedback);
router.delete("/:id", removeFeedback);

export default router;
