import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [role, setRole] = useState("Select Role");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (
      role === "Select Role" ||
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("role", role);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          body: formData, // ❗ DO NOT set Content-Type manually
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful");
      navigate("/"); // redirect to login
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/background.png')" }}
    >
      <div className="relative z-10 w-[350px] rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl p-5 text-white">
        <h2 className="text-xl font-semibold text-center mb-4">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Role */}
          <div className="mb-3">
            <label className="block text-xs mb-1 opacity-80">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option className="text-black">
                Select Role
              </option>
              <option className="text-black">Admin</option>
              <option className="text-black">
                Instructor
              </option>
              <option className="text-black">
                Student
              </option>
            </select>
          </div>

          {/* Full Name */}
          <div className="mb-3">
            <label className="block text-xs mb-1 opacity-80">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-md bg-white/25 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-xs mb-1 opacity-80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-md bg-white/25 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-xs mb-1 opacity-80">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-9 rounded-md bg-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
              >
                {showPassword ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="block text-xs mb-1 opacity-80">
              Re-type Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full px-3 py-2 pr-9 rounded-md bg-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
              >
                {showConfirm ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Upload Image */}
          <label className="mb-4 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-white/20 cursor-pointer text-sm hover:bg-white/30 transition">
            <FaUpload size={14} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setProfileImage(e.target.files[0])
              }
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 transition font-medium disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs mt-3 opacity-80">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-400 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
