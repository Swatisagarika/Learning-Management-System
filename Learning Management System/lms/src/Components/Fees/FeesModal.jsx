import React, { useState, useEffect } from "react";

const FeesModal = ({ onClose, onSave, editData }) => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    rollNo: "",
    studentName: "",
    fees_type: "Tuition",
    payment_type: "Online",
    status: "Paid",
    date: "",
    amount: "",
  });

  const [errors, setErrors] = useState({});

  // Load students from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error loading students:", err));
  }, []);

  // Pre-fill edit data
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const validate = () => {
    let newErrors = {};
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll No is required";
    if (!formData.studentName.trim()) newErrors.studentName = "Student Name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.amount.toString().trim()) newErrors.amount = "Amount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleRollNoChange = (e) => {
    const selectedRoll = e.target.value;
    const matched = students.find((s) => s.rollNo === selectedRoll);
    setFormData((prev) => ({
      ...prev,
      rollNo: selectedRoll,
      studentName: matched ? matched.studentName : "",
    }));
    setErrors((prev) => ({ ...prev, rollNo: "", studentName: "" }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {editData ? "Edit Fees" : "Add Fees"}
        </h2>

        <div className="space-y-4">
          {/* Roll No Dropdown */}
          <div>
            <label className="block text-sm font-medium">Roll No</label>
            <select
              name="rollNo"
              value={formData.rollNo}
              onChange={handleRollNoChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Roll No</option>
              {students.map((student) => (
                <option key={student.id} value={student.rollNo}>
                  {student.rollNo}
                </option>
              ))}
            </select>
            {errors.rollNo && <p className="text-red-500 text-sm">{errors.rollNo}</p>}
          </div>

          {/* Student Name (readonly) */}
          <div>
            <label className="block text-sm font-medium">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
            {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName}</p>}
          </div>

          {/* Fees Type */}
          <div>
            <label className="block text-sm font-medium">Fees Type</label>
            <select
              name="fees_type"
              value={formData.fees_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Tuition">Tuition</option>
              <option value="Library">Library</option>
              <option value="Transport">Transport</option>
              <option value="Exam">Exam</option>
            </select>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium">Payment Type</label>
            <select
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Online">Online</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border px-3 py-2 pl-8 rounded"
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeesModal;
