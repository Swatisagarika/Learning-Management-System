import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const InstructorFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL FEEDBACKS ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/feedbacks")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data); // 👩‍🏫 Instructor sees ALL
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* ================= FILTER ================= */
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  /* ================= EXPORT ================= */
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredFeedbacks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
    XLSX.writeFile(workbook, "course_feedback.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">

        {/* ===== Toolbar ===== */}
        <div className="relative flex items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Instructor - All Course Feedback
          </h1>

          {/* Search */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center">
            <input
              type="text"
              placeholder="Search by student, email, or course..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full max-w-md border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-[rgba(37,150,190,1)]"
            />
          </div>

          {/* Export */}
          <div className="ml-auto">
            <button
              onClick={exportExcel}
              className="px-4 py-2 bg-[rgba(23,131,171,0.9)] text-white rounded-lg shadow hover:bg-[#0e7499] transition"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* ===== Table ===== */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow overflow-hidden">
            <thead className="bg-[rgba(37,150,190,1)] text-white">
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-center">Rating</th>
                <th className="p-3 text-left">Comment</th>
                <th className="p-3 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : currentFeedbacks.length ? (
                currentFeedbacks.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{f.name}</td>
                    <td className="p-3">{f.email}</td>
                    <td className="p-3">{f.course}</td>
                    <td className="p-3 text-center">
                      {"⭐".repeat(f.rating)}
                    </td>
                    <td className="p-3">{f.comment}</td>
                    <td className="p-3 text-center">{f.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No feedback found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination ===== */}
        <div className="flex justify-between items-center mt-6">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorFeedback;
