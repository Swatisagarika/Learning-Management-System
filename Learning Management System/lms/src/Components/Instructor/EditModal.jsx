import React, { useState, useEffect } from "react";

const EditModal = ({ professor, onClose, onSave }) => {
  const [form, setForm] = useState({ ...professor });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (professor.profilePhoto) {
      setAvatarPreview(`http://localhost:5000/uploads/${professor.profilePhoto}`);
    }
  }, [professor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.instructorName?.trim()) newErrors.instructorName = "Name is required.";
    if (!form.department?.trim()) newErrors.department = "Department is required.";
    if (!form.gender?.trim()) newErrors.gender = "Gender is required.";
    if (!form.education?.trim()) newErrors.education = "Education is required.";

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!form.mobileNumber?.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!mobilePattern.test(form.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit Indian mobile number.";
    }

    // Gmail-only email validation
    const emailPattern = /^[a-z0-9._%+-]+@gmail\.com$/;
    if (!form.emailAddress?.trim()) {
      newErrors.emailAddress = "Email is required.";
    } else if (!emailPattern.test(form.emailAddress.toLowerCase())) {
      newErrors.emailAddress = "Email must be a valid gmail.com address.";
    }

    if (!form.joinDate?.trim()) newErrors.joinDate = "Joining date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("instructorName", form.instructorName);
      formData.append("department", form.department);
      formData.append("gender", form.gender);
      formData.append("education", form.education);
      formData.append("mobileNumber", form.mobileNumber);
      formData.append("emailAddress", form.emailAddress);
      formData.append("joinDate", form.joinDate);

      if (form.profilePhoto instanceof File) {
        formData.append("profilePhoto", form.profilePhoto);
      } else {
        formData.append("existingPhoto", professor.profilePhoto);
      }

      const response = await fetch(`http://localhost:5000/api/instructors/${form.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updated = await response.json();
        alert("Instructor updated successfully!");
        onSave(updated);
        onClose();
      } else {
        console.error("Failed to update instructor");
        alert("Failed to update instructor.");
      }
    } catch (err) {
      console.error("Error updating instructor:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Edit Professor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="instructorName"
                value={form.instructorName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.instructorName && <p className="text-red-500 text-xs">{errors.instructorName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Education</label>
              <input
                type="text"
                name="education"
                value={form.education}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.education && <p className="text-red-500 text-xs">{errors.education}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Mobile</label>
              <input
                type="text"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="emailAddress"
                value={form.emailAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.emailAddress && <p className="text-red-500 text-xs">{errors.emailAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Joining Date</label>
              <input
                type="date"
                name="joinDate"
                value={form.joinDate?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.joinDate && <p className="text-red-500 text-xs">{errors.joinDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm border border-gray-300 p-2 rounded mt-1"
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full mt-2 border"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-900"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
