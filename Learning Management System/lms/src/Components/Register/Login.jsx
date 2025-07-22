import React, { useState } from "react";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); 

const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        //  Save token or user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");
        navigate("/dashboard"); // update as per your route
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    alert("Google sign-in logic will go here.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left Side Image */}
        <div className="md:w-1/2 bg-white flex items-center justify-center">
          <img
            src="/Assets/login-bg.jpg"
            alt="Login Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-6">
            Learning Management System
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Email */}
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-100">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent focus:outline-none w-full"
              />
            </div>

{/* Password */}
<div className="flex items-center border rounded-md px-3 py-2 bg-gray-100 relative">
  <FaLock className="text-gray-400 mr-2" />
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    className="bg-transparent focus:outline-none w-full pr-8"
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
    className="absolute right-3 text-gray-500 focus:outline-none"
    tabIndex={-1}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>



            {/* Remember Me + Forgot */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember Me
              </label>
              <Link to="/forgotpassword" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
            >
              SIGN IN
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">Or Sign in With</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full border py-2 rounded-md bg-white hover:bg-gray-100 transition duration-200"
            >
              <FcGoogle className="mr-2 text-xl" />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


