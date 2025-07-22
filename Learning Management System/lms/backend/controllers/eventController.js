const Event = require("../models/eventModel");

// 🔹 Get all events
exports.getEvents = (req, res) => {
  Event.getAllEvents((err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Failed to fetch events." });
    }
    res.json(results);
  });
};

// 🔹 Add a new event
exports.addEvent = (req, res) => {
  const { title, date, time, color } = req.body;

  if (!title || !date || !time || !color) {
    return res.status(400).json({ error: "All fields are required." });
  }

  Event.createEvent({ title, date, time, color }, (err, result) => {
    if (err) {
      console.error("Error adding event:", err);
      return res.status(500).json({ error: "Failed to add event." });
    }

    res.status(201).json({ id: result.insertId });
  });
};

// 🔹 Update an existing event
exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, date, time, color } = req.body;

  if (!title || !date || !time || !color) {
    return res.status(400).json({ error: "All fields are required." });
  }

  Event.updateEvent(id, { title, date, time, color }, (err) => {
    if (err) {
      console.error("Error updating event:", err);
      return res.status(500).json({ error: "Failed to update event." });
    }

    res.json({ message: "Event updated successfully." });
  });
};

// 🔹 Delete an event
exports.deleteEvent = (req, res) => {
  const { id } = req.params;

  Event.deleteEvent(id, (err) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ error: "Failed to delete event." });
    }

    res.json({ message: "Event deleted successfully." });
  });
};
