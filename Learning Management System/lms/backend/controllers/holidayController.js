const Holiday = require("../models/holidayModel");

exports.getHolidays = (req, res) => {
  Holiday.getAllHolidays((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addHoliday = (req, res) => {
  Holiday.createHoliday(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Holiday added successfully" });
  });
};

exports.updateHoliday = (req, res) => {
  const { id } = req.params;
  Holiday.updateHolidayById(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Holiday updated successfully" });
  });
};

exports.deleteHoliday = (req, res) => {
  const { id } = req.params;
  Holiday.deleteHolidayById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Holiday deleted successfully" });
  });
};
