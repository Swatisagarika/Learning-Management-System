import db from "../config/db.js";

export const getAllFeedbacks = async () => {
  const [rows] = await db.query("SELECT * FROM lms.feedbacks ");
  return rows;
};

export const addFeedback = async (data) => {
  const { name, email, course, rating, comment, date } = data;
  const [result] = await db.query(
    "INSERT INTO lms.feedbacks (name, email, course, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, course, rating, comment, date]
  );
  return result;
};

export const updateFeedback = async (id, data) => {
  const { name, email, course, rating, comment, date } = data;
  await db.query(
    "UPDATE lms.feedbacks SET name=?, email=?, course=?, rating=?, comment=?, date=? WHERE id=?",
    [name, email, course, rating, comment, date, id]
  );
};

export const deleteFeedback = async (id) => {
  await db.query("DELETE FROM lms.feedbacks WHERE id=?", [id]);
};
