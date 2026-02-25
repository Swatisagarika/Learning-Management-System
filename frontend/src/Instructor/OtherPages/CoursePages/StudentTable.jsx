import React, { useState } from "react";
import * as XLSX from "xlsx";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";

const StudentTable = ({ students, setStudents }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  // 🔎 Search filter
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📑 Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // 🏆 Update grade
  const handleGradeChange = (id, grade) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, grade } : s
    );
    setStudents(updated);
  };

  // 🗑️ Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };


  // ⬇ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-[rgba(37,150,190,1)]"
        />

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[rgba(37,150,190,1)] text-white rounded-lg shadow hover:bg-[#043b4f] transition"
          >
            + Add Student
          </button>
         
          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-[rgba(37,150,190,1)] text-white rounded-lg shadow hover:bg-[#115269] transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow overflow-hidden">
          <thead className="bg-[rgba(37,150,190,1)] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Progress</th>
              <th className="p-3 text-center">Grade</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3 text-center">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          student.progress >= 75
                            ? "bg-green-500"
                            : student.progress >= 50
                            ? "bg-yellow-400"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {student.progress}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={student.grade}
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded-md"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => setEditStudent(student)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded-md"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[rgba(37,150,190,1)] text-white hover:bg-[rgba(37,150,190,1)]"
            }`}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[rgba(37,150,190,1)] text-white hover:bg-[rgba(37,150,190,1)]"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddStudentModal
          setShowAddModal={setShowAddModal}
          students={students}
          setStudents={setStudents}
        />
      )}
      {editStudent && (
        <EditStudentModal
          student={editStudent}
          setEditStudent={setEditStudent}
          setStudents={setStudents}
          students={students}
        />
      )}
    </div>
  );
};

export default StudentTable;
