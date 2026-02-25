import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useUser } from "../../Components/Context/UserContext";

const StudentFeedback = () => {
  const { user } = useUser(); // get current user
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /* ================= FETCH ONLY LOGGED-IN USER FEEDBACK ================= */
  useEffect(() => {
    if (!user?.email) return;

    fetch("http://localhost:5000/api/feedbacks")
      .then((res) => res.json())
      .then((data) => {
        // 🔥 Filter only current user's feedback
        const userFeedbacks = data.filter(
          (feedback) => feedback.email === user.email
        );
        setFeedbacks(userFeedbacks);
      })
      .catch((err) => console.error(err));
  }, [user]);


  /* ---------------- ADD MODAL ---------------- */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    course: "",
    rating: "",
    comment: "",
    date: "",
  });
  const [addError, setAddError] = useState("");

  /* ---------------- EDIT MODAL ---------------- */
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    course: "",
    rating: "",
    comment: "",
    date: "",
  });
  const [editError, setEditError] = useState("");

  /* ---------------- PRE-FILL ADD FORM WHEN USER CHANGES ---------------- */
  useEffect(() => {
    setAddForm((prev) => ({
      ...prev,
      name: user?.fullName || "",
      email: user?.email || "",
    }));
  }, [user?.fullName, user?.email]);

  /* ---------------- FILTER ---------------- */
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await fetch(`http://localhost:5000/api/feedbacks/${id}`, { method: "DELETE" });
      setFeedbacks(feedbacks.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setEditForm(feedback);
    setEditError("");
  };

  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.email || !editForm.course || !editForm.comment || !editForm.date) {
      setEditError("All fields are required.");
      return;
    }
    if (editForm.rating < 1 || editForm.rating > 5) {
      setEditError("Rating must be between 1 and 5.");
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/feedbacks/${editingFeedback.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      setFeedbacks(feedbacks.map((f) => (f.id === editingFeedback.id ? { ...f, ...editForm } : f)));
      setEditingFeedback(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFeedback = async () => {
    if (!addForm.name || !addForm.email || !addForm.course || !addForm.comment || !addForm.date) {
      setAddError("All fields are required.");
      return;
    }
    if (addForm.rating < 1 || addForm.rating > 5) {
      setAddError("Rating must be between 1 and 5.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();
      setFeedbacks([...feedbacks, { id: data.id, ...addForm }]);
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
        {/* ===== TOOLBAR ===== */}
        <div className="relative flex items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Course Feedback</h1>
          <div className="absolute left-1/2 -translate-x-1/2 w-1/3">
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
          <div className="ml-auto">
            <button
              onClick={() => { setIsAddOpen(true); setAddError(""); }}
              className="px-4 py-2 bg-[rgba(23,131,171,0.9)] hover:bg-[#115269] text-white rounded-lg"
            >
              + Add Feedback
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <table className="w-full">
          <thead className="bg-[rgba(37,150,190,1)] text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedbacks.map((f) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.email}</td>
                <td className="p-3">{f.course}</td>
                <td className="p-3 text-center">{"⭐".repeat(f.rating)}</td>
                <td className="p-3">{f.comment}</td>
                <td className="p-3">{f.date}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button onClick={() => handleEdit(f)} className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200">
                    <FiEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200">
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}
        <div className="flex justify-between items-center mt-6">
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 15].map((n) => (<option key={n}>{n}</option>))}
          </select>

          <div className="flex gap-3">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1 bg-gray-300 rounded">Prev</button>
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 bg-gray-300 rounded">Next</button>
          </div>
        </div>
      </div>

      {/* ===== ADD MODAL ===== */}
      {isAddOpen && (
        <Modal title="Add Feedback" form={addForm} setForm={setAddForm} error={addError} onClose={() => setIsAddOpen(false)} onSave={handleAddFeedback} />
      )}

      {/* ===== EDIT MODAL ===== */}
      {editingFeedback && (
        <Modal title="Edit Feedback" form={editForm} setForm={setEditForm} error={editError} onClose={() => setEditingFeedback(null)} onSave={handleSaveEdit} />
      )}
    </div>
  );
};

/* ===== REUSABLE MODAL ===== */
const Modal = ({ title, form, setForm, error, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 ">
    <div className="bg-white w-[420px] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {error && <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">{error}</div>}

      {["name", "email", "course", "rating", "date"].map((field) => (
        <input
          key={field}
          type={field === "date" ? "date" : "text"}
          placeholder={field}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
      ))}

      <textarea placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full border p-2 rounded mb-3" />

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        <button onClick={onSave} className="bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  </div>
);

export default StudentFeedback; 
