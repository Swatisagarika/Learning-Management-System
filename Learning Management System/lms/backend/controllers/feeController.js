const Fee = require("../models/feeModel");

exports.getFees = (req, res) => {
  Fee.getAllFees((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createFee = (req, res) => {
  Fee.addFee(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Fee record added successfully" });
  });
};

exports.updateFee = (req, res) => {
  const id = req.params.id;
  Fee.updateFee(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Fee record updated successfully" });
  });
};

exports.deleteFee = (req, res) => {
  const id = req.params.id;
  Fee.deleteFee(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Fee record deleted successfully" });
  });
};
