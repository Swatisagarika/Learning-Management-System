import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../Pages/Sidebar";
import Topbar from "../Pages/Topbar";
import HolidayModal from "./HolidayModal";

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);

  // 🔹 Fetch holidays from backend
  const fetchHolidays = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/holidays");
      const data = await res.json();
      setHolidays(data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // 🔹 Add holiday
  const handleAdd = async (holiday) => {
    try {
      const res = await fetch("http://localhost:5000/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(holiday),
      });

      if (res.ok) {
        alert(" Holiday added successfully!");
        fetchHolidays();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.message || "Error adding holiday");
      }
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // 🔹 Update holiday
  const handleUpdate = async (holiday) => {
    try {
      const res = await fetch(`http://localhost:5000/api/holidays/${holiday.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(holiday),
      });

      if (res.ok) {
        alert(" Holiday updated successfully!");
        fetchHolidays();
        setIsModalOpen(false);
        setEditingHoliday(null);
      } else {
        const err = await res.json();
        alert(err.message || "Error updating holiday");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // 🔹 Delete holiday
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/holidays/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchHolidays();
      } else {
        const err = await res.json();
        alert(err.message || "Error deleting holiday");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEditClick = (holiday) => {
    setEditingHoliday(holiday);
    setIsModalOpen(true);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64">
        <Topbar />
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Holiday List - {new Date().getFullYear()}
            </h2>
            <button
              onClick={() => {
                setEditingHoliday(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
            >
              <FaPlus /> Add Holiday
            </button>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-purple-100 text-purple-800 text-left">
                <tr>
                  <th className="p-3">Sl no.</th>
                  <th className="p-3">Holiday Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={holiday.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{holiday.name}</td>
                    <td className="p-3">{holiday.date}</td>
                    <td className="p-3">{holiday.description}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditClick(holiday)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(holiday.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && (
                  <tr>
                    <td className="p-3 text-center text-gray-500" colSpan="5">
                      No holidays available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <HolidayModal
              onClose={() => {
                setIsModalOpen(false);
                setEditingHoliday(null);
              }}
              onSave={editingHoliday ? handleUpdate : handleAdd}
              initialData={editingHoliday}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Holiday;
