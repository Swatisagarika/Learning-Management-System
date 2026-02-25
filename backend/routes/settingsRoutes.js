import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

// routes/settings.routes.js
router.get("/settings", getSettings);
router.put("/settings", upload.single("profileImage"), updateSettings);

export default router;
