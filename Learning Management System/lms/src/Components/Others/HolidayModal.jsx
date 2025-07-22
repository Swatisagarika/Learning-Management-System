import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
 
const HolidayModal = ({ onClose, onSave, initialData }) => {
  const [holidayData, setHolidayData] = useState({
    name: "",
    date: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
 
  useEffect(() => {
    if (initialData) {
      setHolidayData(initialData);
    }
  }, [initialData]);
 
  const validate = () => {
    let tempErrors = {};
    if (!holidayData.name.trim()) tempErrors.name = "Holiday name is required.";
    if (!holidayData.date) tempErrors.date = "Date is required.";
    if (!holidayData.description.trim())
      tempErrors.description = "Description is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = initialData
        ? { ...holidayData, id: initialData.id }
        : holidayData;
      onSave(payload);
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-lg relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {initialData ? "Edit Holiday" : "Add Holiday"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Holiday Name</label>
              <input
                type="text"
                value={holidayData.name}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Republic Day"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
 
            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium">Date</label>
              <input
                type="date"
                value={holidayData.date}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, date: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
 
            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                value={holidayData.description}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, description: e.target.value })
                }
                rows="3"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Short description of the holiday"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
 
            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded"
              >
                {initialData ? "Update" : "Add"} Holiday
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default HolidayModal;