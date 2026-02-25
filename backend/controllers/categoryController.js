const Category = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Category name is required" });

  try {
    const newCategory = await Category.addCategory(name);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to add category" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.deleteCategoryById(id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
