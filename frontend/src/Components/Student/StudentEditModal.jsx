import React, { useState, useEffect } from "react";

const StudentEditModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setForm({ ...student });
      if (student.profilePhoto) {
        setAvatarPreview(`http://localhost:5000/uploads/${student.profilePhoto}`);
      }
    }
  }, [student]);

  useEffect(() => {
    if (form.avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(form.avatarFile);
    }
  }, [form.avatarFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({ ...prev, avatarFile: file }));
      setErrors((prev) => ({ ...prev, avatarFile: null }));
    } else {
      setErrors((prev) => ({
        ...prev,
        avatarFile: "Only image files are allowed.",
      }));
    }
  };

  const validate = async () => {
    const newErrors = {};

    // Name
    if (!form.studentName?.trim()) newErrors.studentName = "studentName is required.";

    // Class
    if (!form.className?.trim()) newErrors.className = "Class is required.";

    // Roll No
    if (!form.rollNo?.trim()) {
      newErrors.rollNo = "Roll No is required.";
    } else {
      try {
        const params = new URLSearchParams({
          rollNo: form.rollNo,
          ...(form.id ? { excludeId: form.id } : {}),
        });
        const res = await fetch(`http://localhost:5000/api/students/check-rollno?${params}`);
        const data = await res.json();
        if (data.exists) {
          newErrors.rollNo = "Roll No already exists.";
        }
      } catch (error) {
        console.error("RollNo check failed:", error);
        newErrors.rollNo = "Failed to validate roll number.";
      }
    }

    // Gender
    if (!form.gender) newErrors.gender = "Gender is required.";

    // DOB
    if (!form.dob) newErrors.dob = "Date of Birth is required.";

    // Email
    if (!form.email?.trim() || !/^[a-z0-9._%+-]+@gmail\.com$/.test(form.email.toLowerCase())) {
      newErrors.email = "Valid @gmail.com email required.";
    } else {
      try {
        const params = new URLSearchParams({
          email: form.email,
          ...(form.id ? { excludeId: form.id } : {}),
        });
        const res = await fetch(`http://localhost:5000/api/students/check-email?${params}`);
        const data = await res.json();
        if (data.exists) {
          newErrors.email = "Email already exists.";
        }
      } catch (error) {
        console.error("Email check failed:", error);
        newErrors.email = "Failed to validate email.";
      }
    }

    // Mobile
    if (!form.mobile?.trim() || !/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Valid 10-digit mobile number required.";
    }

    // Address
    if (!form.address?.trim()) newErrors.address = "Address is required.";

    // Profile Photo
    if (!form.id && !form.avatarFile) {
      newErrors.avatarFile = "Profile photo is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) return;

    onSave(form); // send form to parent
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4">
        <h2 className="text-lg font-bold mb-3 text-[rgba(37,150,190,1)]">
          {form.id ? "Edit Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium">Student Name</label>
              <input
                name="studentName"
                type="text"
                value={form.studentName || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.studentName && <p className="text-red-500 text-xs">{errors.studentName}</p>}
            </div>

            <div>
              <label className="font-medium">Roll No</label>
              <input
                name="rollNo"
                type="text"
                value={form.rollNo || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.rollNo && <p className="text-red-500 text-xs">{errors.rollNo}</p>}
            </div>

            <div>
              <label className="font-medium">Class</label>
              <input
                name="className"
                type="text"
                value={form.className || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.className && <p className="text-red-500 text-xs">{errors.className}</p>}
            </div>

            <div>
              <label className="font-medium">Gender</label>
              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
            </div>

            <div>
              <label className="font-medium">Date of Birth</label>
              <input
                name="dob"
                type="date"
                value={form.dob || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label className="font-medium">Mobile</label>
              <input
                name="mobile"
                type="text"
                value={form.mobile || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="font-medium">Address</label>
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
                rows={2}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>

            <div>
              <label className="font-medium">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded mt-1"
              />
              {errors.avatarFile && <p className="text-red-500 text-xs">{errors.avatarFile}</p>}
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-14 h-14 mt-2 rounded-full border"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[rgba(37,150,190,1)] text-white rounded hover:bg-[rgba(37,150,190,1)]"
            >
              {form.id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditModal;
