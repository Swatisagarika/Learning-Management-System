const Lesson = require("../models/lessonModel");

exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.getAllLessons();
    res.json({ data: lessons });
  } catch (err) {
    console.error("GET LESSONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const lesson = await Lesson.createLesson({
      title: req.body.title,
      type: req.body.type,
      file: req.file ? req.file.filename : null,
      externalLink: req.body.externalLink || null,
      mandatory: req.body.mandatory === "true",
      allowDownload: req.body.allowDownload === "true",
      status: req.body.status,
    });

    res.status(201).json(lesson);
  } catch (err) {
    console.error("ADD LESSON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    await Lesson.updateLesson(req.params.id, {
      title: req.body.title,
      type: req.body.type,
      externalLink: req.body.externalLink,
      mandatory: req.body.mandatory === "true",
      allowDownload: req.body.allowDownload === "true",
      status: req.body.status,
      file: req.file ? req.file.filename : null,
    });

    res.json({ message: "Lesson updated successfully" });
  } catch (err) {
    console.error("UPDATE LESSON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.deleteLesson(req.params.id);
    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    console.error("DELETE LESSON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
