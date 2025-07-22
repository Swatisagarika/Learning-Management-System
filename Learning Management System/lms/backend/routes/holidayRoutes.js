const express = require("express");
const router = express.Router();
const {
  getHolidays,
  addHoliday,
  updateHoliday,
  deleteHoliday,
} = require("../controllers/holidayController");

router.get("/", getHolidays);
router.post("/", addHoliday);
router.put("/:id", updateHoliday);
router.delete("/:id", deleteHoliday);

module.exports = router;
