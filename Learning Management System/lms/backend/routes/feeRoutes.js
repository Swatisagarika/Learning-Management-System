const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

router.get("/", feeController.getFees);
router.post("/", feeController.createFee);
router.put("/:id", feeController.updateFee);
router.delete("/:id", feeController.deleteFee);

module.exports = router;
