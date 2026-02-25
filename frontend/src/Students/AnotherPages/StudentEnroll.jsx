import React, { useState, useMemo } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const StudentEnrollTable = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      course: "Computer Science",
      year: "3rd Year",
      contact: "9876543210",
      paymentMethod: "Card",
      enrollment: "Enrolled",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      course: "Information Technology",
      year: "2nd Year",
      contact: "9876501234",
      paymentMethod: "UPI",
      enrollment: "Enrolled",
    },
  ]);

  /* ---------------- MODALS ---------------- */
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(null);

  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      `${s.name} ${s.course} ${s.paymentMethod} ${s.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, students]);

  /* ---------------- PAGINATION ---------------- */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = (id) => {
    if (window.confirm("Delete this student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const openAddModal = () => {
    setForm({
      name: "",
      email: "",
      course: "",
      year: "1st Year",
      contact: "",
      paymentMethod: "payment Method",
      enrollment: "Enrolled",
    });
    setAddOpen(true);
  };

  const openEditModal = (student) => {
    setForm(student);
    setEditOpen(true);
  };

  const handleAddStudent = () => {
    setStudents([
      ...students,
      {
        id: Date.now(),
        ...form,
      },
    ]);
    setAddOpen(false);
  };

  const handleEditStudent = () => {
    setStudents(students.map((s) => (s.id === form.id ? form : s)));
    setEditOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      

        <div className="p-8">
          {/* ---------- TOP BAR ---------- */}
          <div className="flex items-center mb-6 gap-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Student Enrollment
            </h1>

            <div className="flex-1 flex justify-center">
              <input
                type="text"
                placeholder="Search by name, course, email or payment..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-4 py-2 rounded-lg w-96 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <button
              onClick={openAddModal}
              className=" text-white px-5 py-2 rounded-lg bg-[rgba(37,150,190,1)] hover:bg-[#115269] transition"
            >
              + Add Student
            </button>
          </div>

          {/* ---------- TABLE ---------- */}
          <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[rgba(37,150,190,1)] text-white">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Enrollment</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{student.name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.course}</td>
                    <td className="p-4">{student.year}</td>
                    <td className="p-4">{student.contact}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                        {student.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4">{student.enrollment}</td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(student)}
                          className="bg-blue-100 text-blue-600 p-2 rounded-lg"
                        >
                          <FiEdit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

      {/* ---------- ADD MODAL ---------- */}
      {addOpen && (
        <Modal
          title="Add Student"
          form={form}
          setForm={setForm}
          onClose={() => setAddOpen(false)}
          onSave={handleAddStudent}
        />
      )}

      {/* ---------- EDIT MODAL ---------- */}
      {editOpen && (
        <Modal
          title="Edit Student"
          form={form}
          setForm={setForm}
          onClose={() => setEditOpen(false)}
          onSave={handleEditStudent}
        />
      )}
    </div>
  );
};

/* ---------- REUSABLE MODAL ---------- */
const Modal = ({ title, form, setForm, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[420px] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <input
        placeholder="Student Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        placeholder="Course"
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <select
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      >
        <option>1st Year</option>
        <option>2nd Year</option>
        <option>3rd Year</option>
      </select>

      <input
        placeholder="Contact"
        value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <select
        value={form.enrollment}
        onChange={(e) => setForm({ ...form, enrollment: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      >
        <option>Enrolled</option>
        <option>Not Enrolled</option>
      </select>

      <select
        value={form.paymentMethod}
        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
        className="w-full border p-2 rounded mb-5"
      >
        <option>payment Method</option>
        <option>Free</option>
        <option>Card</option>
        <option>UPI</option>
      </select>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default StudentEnrollTable;
