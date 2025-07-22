const db = require("../config/db");

exports.getAllFees = (callback) => {
  db.query("SELECT * FROM fees ORDER BY id DESC", callback);
};

exports.addFee = (data, callback) => {
  const sql = `INSERT INTO fees (rollNo, studentName, fee_type, payment_type, status, date, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    data.rollNo,
    data.studentName,
    data.fee_type,
    data.payment_type,
    data.status,
    data.date,
    data.amount,
  ];
  db.query(sql, values, callback);
};

exports.updateFee = (id, data, callback) => {
  const sql = `UPDATE fees SET rollNo=?, studentName=?, fee_type=?, payment_type=?, status=?, date=?, amount=? WHERE id=?`;
  const values = [
    data.rollNo,
    data.studentName,
    data.fee_type,
    data.payment_type,
    data.status,
    data.date,
    data.amount,
    id,
  ];
  db.query(sql, values, callback);
};

exports.deleteFee = (id, callback) => {
  db.query("DELETE FROM fees WHERE id = ?", [id], callback);
};
