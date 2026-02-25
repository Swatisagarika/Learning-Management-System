const pool = require("../db/pool");

// Fetch all categories
const getAllCategories = async () => {
  const [rows] = await pool.query("SELECT * FROM lms.categories");
  return rows;
};

// Add a new category
const addCategory = async (name) => {
  const query = "INSERT INTO lms.categories (categoryName) VALUES (?)";
  const [result] = await pool.query(query, [categoryName]);
  return { id: result.insertId, name };
};

// Delete category by ID
const deleteCategoryById = async (id) => {
  const [result] = await pool.query("DELETE FROM lms.categories WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllCategories,
  addCategory,
  deleteCategoryById,
};
