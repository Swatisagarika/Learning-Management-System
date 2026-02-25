import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditModal from "./EditModal";
import { Link } from "react-router-dom";


const InstructorList = () => {
  const [view, setView] = useState("list");
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/instructors");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching instructors:", err);
    }
  };

  const handleEdit = (prof) => setEditing(prof);

  const handleSaveEdit = (updatedProf) => {
    setData((prev) =>
      prev.map((p) => (p.id === updatedProf.id ? updatedProf : p))
    );
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/instructors/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          const updated = data.filter((prof) => prof.id !== id);
          setData(updated);

          const totalPages = Math.ceil(updated.length / itemsPerPage);
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }
        } else {
          alert("Failed to delete instructor.");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Instructor List</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <Link to="/addinstructor">
                <button className="bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded hover:bg-[#146887] text-sm">
                  + Add New
                </button>
              </Link>
              <button
                className={`px-4 py-2 rounded text-white text-sm ${view === "list" ? "bg-[rgba(37,150,190,1)]" : "bg-gray-400"}`}
                onClick={() => setView("list")}
              >
                List View
              </button>
              <button
                className={`px-4 py-2 rounded text-white text-sm ${view === "grid" ? "bg-[rgba(37,150,190,1)]" : "bg-gray-400"}`}
                onClick={() => setView("grid")}
              >
                Grid View
              </button>
            </div>
          </div>

          {/* List View */}
          {view === "list" && (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[rgba(37,150,190,1)] text-white text-left text-sm font-semibold ">
                  <tr>
                    <th className="p-3">Sl. No.</th>
                    <th className="p-3">Profile</th>
                    <th className="p-3">Instructor Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Education</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Joining Date</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {paginatedData.map((prof, index) => (
                    <tr key={prof.id}>
                      <td className="p-3">{startIndex + index + 1}</td>
                      <td className="p-3">
                        <img
                          src={`http://localhost:5000/uploads/${prof.profilePhoto}`}
                          alt={prof.instructorName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="p-3">{prof.instructorName}</td>
                      <td className="p-3">{prof.department}</td>
                      <td className="p-3">{prof.gender}</td>
                      <td className="p-3">{prof.education}</td>
                      <td className="p-3">{prof.mobileNumber}</td>
                      <td className="p-3">{prof.emailAddress}</td>
                      <td className="p-3">{prof.joinDate}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                          onClick={() => handleEdit(prof)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                          onClick={() => handleDelete(prof.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {view === "grid" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedData.map((prof, index) => (
                <div
                  key={prof.id}
                  className="relative bg-white p-4 rounded shadow flex flex-col items-center text-center"
                >
                  <span className="absolute top-2 left-2 bg-[rgba(37,150,190,1)] text-white text-xs px-2 py-1 rounded-full">
                    #{startIndex + index + 1}
                  </span>
                  <img
                    src={`http://localhost:5000/uploads/${prof.profilePhoto}`}
                    alt={prof.instructorName}
                    className="w-20 h-20 rounded-full mb-2 object-cover"
                  />
                  <h3 className="font-semibold text-[rgba(37,150,190,1)]">{prof.instructorName}</h3>
                  <p className="text-sm text-gray-500">{prof.department}</p>
                  <p className="text-xs text-gray-400">{prof.education}</p>
                  <p className="text-xs text-gray-500 mt-1">{prof.mobileNumber}</p>
                  <p className="text-xs text-gray-500">{prof.emailAddress}</p>
                  <p className="text-xs text-gray-500">{prof.joinDate}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                      onClick={() => handleEdit(prof)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(prof.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[rgba(37,150,190,1)] hover:bg-[rgba(37,150,190,1)] text-white"
              }`}
            >
              Prev
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[rgba(37,150,190,1)] hover:bg-[rgba(37,150,190,1)] text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {editing && (
          <EditModal
            professor={editing}
            onClose={() => setEditing(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
  );
};

export default InstructorList;
