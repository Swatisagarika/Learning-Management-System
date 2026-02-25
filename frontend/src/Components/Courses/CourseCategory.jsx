import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const CourseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //  Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Unexpected response:", data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //  Add category to backend
  const handleAdd = async () => {
    const trimmed = newCategory.trim();

    if (!trimmed) {
      setError("Category name is required.");
      clearMessages();
      return;
    }

    if (
      Array.isArray(categories) &&
      categories.some((cat) => cat.categoryName.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError("This category already exists.");
      clearMessages();
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: trimmed }),
      });

      if (response.ok) {
        const newCat = await response.json();
        setCategories((prev) => [...prev, newCat]);
        setNewCategory("");
        alert(" Category added successfully!");
        //setSuccessMessage(" Category added successfully!");
      } else {
        const errRes = await response.json();
        setError(errRes.error || "Failed to add category.");
      }
    } catch (err) {
      console.error("Add category error:", err);
      setError("Failed to add category.");
    } finally {
      clearMessages();
    }
  };

  //  Delete category from backend
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        setSuccessMessage(" Category deleted successfully!");
      } else {
        setError("Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting category.");
    } finally {
      clearMessages();
    }
  };

  //  Auto-clear messages
  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className=" min-h-screen bg-gray-100">
        <div className="p-4 max-w-2xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Categories</h2>

            {/* Success & Error Messages */}
            {successMessage && (
              <p className="text-green-600 text-sm font-medium mb-3">{successMessage}</p>
            )}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
              />
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-[rgba(37,150,190,1)] hover:bg-[#0c4a60] text-white px-4 py-2 rounded"
              >
                <FaPlus /> Add
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto mt-4">
              <ul className="space-y-2">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded shadow-sm hover:bg-gray-200 transition"
                    >
                      <span className="text-gray-800 font-medium">{cat.categoryName}</span>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm italic">No categories available.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CourseCategory;
