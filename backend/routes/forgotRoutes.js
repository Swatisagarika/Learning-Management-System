const express = require("express");
const router = express.Router();

const forgotController = require("../controllers/forgotController");

router.post("/", forgotController.forgotPassword);
router.post("/reset", forgotController.resetPassword);

module.exports = router;
