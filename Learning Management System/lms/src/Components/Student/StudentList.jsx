import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "../Pages/Sidebar";
import Topbar from "../Pages/Topbar";
import StudentEditModal from "./StudentEditModal";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSave = async (studentData) => {
    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(studentData)) {
        if (key === "avatarFile" && value instanceof File) {
          formData.append("profilePhoto", value);
        } else {
          formData.append(key, value);
        }
      }

      const isEdit = !!studentData.id;

      const requestOptions = {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      };

      const url = isEdit
        ? `http://localhost:5000/api/students/${studentData.id}`
        : "http://localhost:5000/api/students";

      const res = await fetch(url, requestOptions);

      if (res.ok) {
        fetchStudents();
        setEditingStudent(null);
        alert(isEdit ? "Student updated successfully!" : "Student added successfully!");
      } else {
        alert("Failed to save student. Please try again.");
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("An error occurred while saving the student.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`http://localhost:5000/api/students/${id}`, {
          method: "DELETE",
        });
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleAdd = () => {
    setEditingStudent({
      id: null,
      studentName: "",
      rollNo: "",
      className: "",
      gender: "",
      dob: "",
      email: "",
      mobile: "",
      address: "",
      avatarFile: null,
      profilePhoto: "",
    });
  };

  const handleEdit = (student) => {
    setEditingStudent({
      ...student,
      avatarFile: null,
    });
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const displayedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64">
        <Topbar />
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-800">Student List</h2>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
            >
              <FaPlus /> Add Student
            </button>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                <tr>
                  <th className="p-3">Sl. No.</th>
                  <th className="p-3">Profile</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">DOB</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {displayedStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3">
                      <img
                        src={
                          student.profilePhoto
                            ? `http://localhost:5000/uploads/${student.profilePhoto}`
                            : "https://via.placeholder.com/40"
                        }
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-3">{student.studentName}</td>
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">{student.className}</td>
                    <td className="p-3">{student.gender}</td>
                    <td className="p-3">{student.dob}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.mobile}</td>
                    <td className="p-3">{student.address}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal */}
        {editingStudent && (
          <StudentEditModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default StudentList;
