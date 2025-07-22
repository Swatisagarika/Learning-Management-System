const pool = require("../config/db");

// Get all holidays
exports.getAllHolidays = (callback) => {
  pool.query("SELECT * FROM lms.holidays", callback);
};

// Add a new holiday
exports.createHoliday = (data, callback) => {
  const { name, date, description } = data;
  pool.query(
    "INSERT INTO lms.holidays (name, date, description) VALUES (?, ?, ?)",
    [name, date, description],
    callback
  );
};

// Update a holiday
exports.updateHolidayById = (id, data, callback) => {
  const { name, date, description } = data;
  pool.query(
    "UPDATE lms.holidays SET name=?, date=?, description=? WHERE id=?",
    [name, date, description, id],
    callback
  );
};

// Delete a holiday
exports.deleteHolidayById = (id, callback) => {
  pool.query("DELETE FROM lms.holidays WHERE id=?", [id], callback);
};
