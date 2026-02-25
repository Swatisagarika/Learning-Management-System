const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const lessonController = require("../controllers/lessonController");

router.get("/", lessonController.getLessons);
router.post("/", upload.single("file"), lessonController.addLesson);
router.put("/:id", upload.single("file"), lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
