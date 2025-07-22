import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitted(true);
        } else {
          setServerError(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error:", error);
        setServerError("Failed to connect to server");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg w-full max-w-md p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email and we'll send you a password reset link
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {serverError && (
              <div className="text-sm text-red-500 text-center">{serverError}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded shadow transition duration-300"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600 font-semibold">
             A reset link has been sent to your email.
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          <a href="/" className="text-blue-500 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
