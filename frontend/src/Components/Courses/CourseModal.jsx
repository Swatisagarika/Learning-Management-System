import React, { useEffect, useState } from "react";

const defaultTitles = [
  "React for Beginners",
  "Advanced Python",
  "Full Stack Development",
  "UI/UX Design Basics",
  "Data Science with Python",
  "Other",
];

const CourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...course });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showCustomTitle, setShowCustomTitle] = useState(false);

  //  Fetch categories and instructors from backend
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          const categoryNames = data.map((cat) => cat.categoryName);
          setCategories(categoryNames);
        } else {
          console.error("Invalid category response format");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    // Fetch instructors
    const fetchInstructors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/instructors");
        const data = await res.json();
        setInstructors(data);
      } catch (err) {
        console.error("Failed to fetch instructors", err);
        setInstructors([
          { instructorName: "John Doe" },
          { instructorName: "Jane Smith" },
        ]);
      }
    };

    fetchCategories();
    fetchInstructors();
  }, []);

  //  Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.instructorName?.trim())
      newErrors.instructorName = "Instructor is required.";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
    if (!formData.categoryName.trim()) newErrors.categoryName = "Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "title" && value === "Other") {
      setShowCustomTitle(true);
      setFormData((prev) => ({ ...prev, title: "" }));
    }
  };

  //  Handle dropdown selection for title
  const handleTitleSelect = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setShowCustomTitle(true);
      setFormData((prev) => ({ ...prev, title: "" }));
    } else {
      setShowCustomTitle(false);
      setFormData((prev) => ({ ...prev, title: value }));
    }
  };

  //  Submit
  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-5 text-[rgba(37,150,190,1)]">
          {formData.id ? "Edit Course" : "Add New Course"}
        </h2>

        {/*  Title */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title
          </label>
          <select
            onChange={handleTitleSelect}
            className="w-full px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
            defaultValue={
              defaultTitles.includes(formData.title) ? formData.title : ""
            }
          >
            <option value="">Select</option>
            {defaultTitles.map((title, i) => (
              <option key={i} value={title}>
                {title}
              </option>
            ))}
          </select>
          {showCustomTitle && (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter custom title"
              className="mt-2 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
            />
          )}
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/*  Instructor */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Instructor Name
          </label>
          <select
            name="instructorName"
            value={formData.instructorName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
          >
            <option value="">Select Instructor</option>
            {instructors.map((inst, i) => (
              <option key={i} value={inst.instructorName}>
                {inst.instructorName}
              </option>
            ))}
          </select>
          {errors.instructorName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.instructorName}
            </p>
          )}
        </div>

        {/*  Duration */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 6 weeks"
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
          )}
        </div>

        {/*  Category */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Category Name
          </label>
          <select
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-white focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoryName && (
            <p className="text-red-500 text-xs mt-1">{errors.categoryName}</p>
          )}
        </div>

        {/*  Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[rgba(37,150,190,1)] text-white rounded hover:bg-[rgba(37,150,190,1)]"
          >
            {formData.id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
