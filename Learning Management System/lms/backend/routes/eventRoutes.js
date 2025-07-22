// routes/eventRoutes.js

const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// 🔹 GET all events
router.get("/", eventController.getEvents);

// 🔹 POST a new event
router.post("/", eventController.addEvent);

// 🔹 PUT (update) an event by ID
router.put("/:id", eventController.updateEvent);

// 🔹 DELETE an event by ID
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
