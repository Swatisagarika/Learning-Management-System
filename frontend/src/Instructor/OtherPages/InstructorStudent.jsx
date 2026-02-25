import React, { useState, useMemo } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import * as XLSX from "xlsx";

/* 🎓 Grade Calculation */
const getGrade = (percent) => {
  if (percent >= 80) return "O";
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 40) return "D";
  if (percent >= 30) return "E";
  return "F";
};

export default function StudentManagement() {

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      course: "Computer Science",
      year: "3rd Year",
      phone: "9876543210",
      enrolled: true,
      percent: 85,
      grade: "O",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      course: "Information Technology",
      year: "2nd Year",
      phone: "9876501234",
      enrolled: true,
      percent: 72,
      grade: "A",
      status: "Active",
    },
  ]);

  /* 🔍 Search */
  const [search, setSearch] = useState("");

  /* ✏️ Edit Modal */
  const [editStudent, setEditStudent] = useState(null);

  /* 🔍 Filter */
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  /* ❌ Delete */
  const handleDelete = (id) => {
    if (window.confirm("Delete this student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  /* 💾 Save Edit */
  const handleUpdate = () => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editStudent.id
          ? {
              ...s,
              percent: editStudent.percent,
              grade: getGrade(editStudent.percent),
              status: editStudent.status,
            }
          : s
      )
    );
    setEditStudent(null);
  };

  /* 📤 Export Excel */
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100">

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">
            {/* 🔝 Top Bar */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                Student Management
              </h2>

              <div className="flex-1 flex justify-center">
                <input
                  type="text"
                  placeholder="Search by name, course, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-4 py-2 rounded-lg w-96 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <button
                onClick={exportExcel}
                className="px-4 py-2 bg-[rgba(37,150,190,1)] text-white rounded-lg hover:bg-[#115269] transition whitespace-nowrap"
              >
                Export Excel
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-[rgba(37,150,190,1)] text-white">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Enrollment</th>
                    <th className="p-3">Mark %</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3">{s.email}</td>
                      <td className="p-3">{s.course}</td>
                      <td className="p-3">{s.year}</td>
                      <td className="p-3">
                        {s.enrolled ? "Enrolled" : "Not Enrolled"}
                      </td>
                      <td className="p-3">{s.percent}%</td>
                      <td className="p-3 font-bold">{s.grade}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            s.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditStudent({ ...s })}
                            className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-6 text-center text-gray-500">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* ✏️ Edit Modal */}
      {editStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Student</h3>

            <label className="text-sm font-medium">Mark %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={editStudent.percent}
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  percent: Number(e.target.value),
                  grade: getGrade(Number(e.target.value)),
                })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <p className="text-gray-700 mb-3">
              Grade: <span className="font-bold">{editStudent.grade}</span>
            </p>

            <label className="text-sm font-medium">Status</label>
            <select
              value={editStudent.status}
              onChange={(e) =>
                setEditStudent({ ...editStudent, status: e.target.value })
              }
              className="border p-2 w-full mb-4 rounded"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditStudent(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
