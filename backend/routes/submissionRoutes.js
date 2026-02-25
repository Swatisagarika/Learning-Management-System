const router = require("express").Router();
const submissionController = require("../controllers/submissionController");

router.post("/quiz", submissionController.submitQuiz);
router.get("/quiz", submissionController.getQuizSubmissions);

router.post("/assignment", submissionController.submitAssignment);
router.get("/assignment", submissionController.getAssignmentSubmissions);

module.exports = router;
