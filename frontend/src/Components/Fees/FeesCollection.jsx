import React, { useState, useEffect } from "react";
import FeesModal from "./FeesModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const FeesCollection = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feesData, setFeesData] = useState([]);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fees");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFeesData(data);
    } catch (err) {
      console.error("Error fetching fees:", err);
    }
  };

  const handleSave = async (feeData) => {
    try {
      const method = feeData.id ? "PUT" : "POST";
      const url = feeData.id
        ? `http://localhost:5000/api/fees/${feeData.id}`
        : "http://localhost:5000/api/fees";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeData),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Save failed:", err);
        alert("Failed to save fee. Try again.");
        return;
      }

      fetchFees();
      setShowModal(false);
      setEditData(null);

      //  Show success alert
      if (feeData.id) {
        alert("Fees updated successfully!");
      } else {
        alert("Fees added successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving fee.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/fees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchFees();
    } catch (err) {
      console.error(err);
      alert("Error deleting fee.");
    }
  };

  const filtered = feesData.filter((f) =>
    f.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className=" min-h-screen bg-gray-100">
        <div className="p-4 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Fees Collection</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[rgba(37,150,190,1)] hover:bg-[#177091] text-white px-4 py-2 rounded"
            >
              + Add Fees
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="border px-3 py-2 rounded w-full md:w-1/3"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span>Total Records: {filtered.length}</span>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[rgba(37,150,190,1)] text-white">
                <tr>
                  <th className="py-3 px-4">Sl No.</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Fees Type</th>
                  <th className="py-3 px-4">Payment Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((fee, idx) => (
                  <tr key={fee.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{start + idx + 1}</td>
                    <td className="py-2 px-4">{fee.rollNo}</td>
                    <td className="py-2 px-4">{fee.studentName}</td>
                    <td className="py-2 px-4">{fee.fees_type}</td>
                    <td className="py-2 px-4">{fee.payment_type}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          fee.status === "Paid"
                            ? "bg-green-500"
                            : fee.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{fee.date}</td>
                    <td className="py-2 px-4 font-semibold">{fee.amount}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditData(fee);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(fee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {showModal && (
          <FeesModal
            onClose={() => {
              setShowModal(false);
              setEditData(null);
            }}
            onSave={handleSave}
            editData={editData}
          />
        )}
      </div>
  );
};

export default FeesCollection;
