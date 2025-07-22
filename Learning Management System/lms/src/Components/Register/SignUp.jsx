import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.agree) newErrors.agree = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registered successfully!");
          setForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            agree: false,
          });
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error, please try again later.");
      }
    }
  };

  const handleGoogleRegister = () => {
    alert("Google registration logic goes here");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="/Assets/login-bg.jpg"
            alt="Sign Up Visual"
            className="max-h-72 w-auto object-contain"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Learning Management System
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}


            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-10 py-2 pr-12 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Retype Password"
                className="w-full px-10 py-2 pr-12 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2.5 right-3 text-gray-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>


            {/* Agree Checkbox */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="accent-blue-500"
              />
              I agree to the terms and conditions
            </label>
            {errors.agree && <p className="text-sm text-red-500">{errors.agree}</p>}

            {/* Submit Button */}
           <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded shadow transition duration-300 cursor-pointer"
            >
              REGISTER
            </button>
          </form>

          {/* Already have account */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>

          {/* Google Registration */}
          <div className="mt-6 text-center text-sm text-gray-500">
            - Or Register With -
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="flex items-center gap-3 bg-white px-6 py-2 rounded shadow hover:bg-gray-100 transition cursor-pointer"
            >
              <FcGoogle size={24} />
              <span className="text-sm text-gray-700 font-medium">
                Register with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
