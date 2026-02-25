const router = require("express").Router();
const assignmentController = require("../controllers/assignmentController");

router.post("/", assignmentController.createAssignment);
router.get("/", assignmentController.getAssignments);

module.exports = router;
