import React, { useState } from "react";
import Sidebar from "../Pages/Sidebar";
import Topbar from "../Pages/Topbar";
import { useNavigate } from "react-router-dom";

const AddInstructor = () => {
  const [form, setForm] = useState({
    name: "",
    department: "",
    gender: "",
    education: "",
    mobile: "",
    email: "",
    joinDate: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.gender.trim()) newErrors.gender = "Gender is required";
    if (!form.education.trim()) newErrors.education = "Education is required";

    // Mobile number validation
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile is required";
    } else if (!mobilePattern.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    // Gmail email validation
    const emailPattern = /^[a-z0-9._%+-]+@gmail\.com$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(form.email.toLowerCase())) {
      newErrors.email = "Email must be a valid gmail.com address";
    }

    if (!form.joinDate) newErrors.joinDate = "Join Date is required";
    if (!form.avatar) newErrors.avatar = "Profile photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "email" ? value.toLowerCase() : value;
    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setErrors((prev) => ({
        ...prev,
        avatar: "Only image files are allowed",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("instructorName", form.name);
    formData.append("department", form.department);
    formData.append("gender", form.gender);
    formData.append("education", form.education);
    formData.append("mobileNumber", form.mobile);
    formData.append("emailAddress", form.email);
    formData.append("joinDate", form.joinDate);
    formData.append("profilePhoto", form.avatar);

    try {
      const res = await fetch("http://localhost:5000/api/instructors", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Instructor added successfully!");
        navigate("/instructorlist");
      } else {
        alert("Error: " + (data.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64">
        <Topbar />
        <div className="p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2">
              Add New Instructor
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={form.joinDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.joinDate && <p className="text-red-500 text-sm">{errors.joinDate}</p>}
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-16 h-16 rounded-full object-cover shadow"
                    />
                  )}
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstructor;
