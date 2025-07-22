// models/eventModel.js
const db = require("../config/db");

// 🔹 Get all events
exports.getAllEvents = (callback) => {
  const query = "SELECT * FROM lms.events ORDER BY date, time";
  db.query(query, callback);
};

// 🔹 Create a new event
exports.createEvent = (event, callback) => {
  const { title, date, time, color } = event;

  if (!title || !date || !time || !color) {
    return callback(new Error("Missing required fields"), null);
  }

  const query = "INSERT INTO lms.events (title, date, time, color) VALUES (?, ?, ?, ?)";
  db.query(query, [title, date, time, color], callback);
};

// 🔹 Update an existing event
exports.updateEvent = (id, event, callback) => {
  const { title, date, time, color } = event;

  if (!title || !date || !time || !color) {
    return callback(new Error("Missing required fields"), null);
  }

  const query = `
    UPDATE lms.events
    SET title = ?, date = ?, time = ?, color = ?
    WHERE id = ?
  `;
  db.query(query, [title, date, time, color, id], callback);
};

// 🔹 Delete an event
exports.deleteEvent = (id, callback) => {
  const query = "DELETE FROM lms.events WHERE id = ?";
  db.query(query, [id], callback);
};
