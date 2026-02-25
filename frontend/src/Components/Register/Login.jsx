import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext"; // ✅ import context hook

export default function Login() {
  const navigate = useNavigate();
  const { updateUser } = useUser(); // ✅ get updateUser from context

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token, user } = data;

      // Normalize role
      const normalizedUser = {
        ...user,
        role: user.role?.trim().toLowerCase(),
      };
      // ✅ Save user to context
updateUser(normalizedUser);

// ✅ Save auth data
localStorage.setItem("token", token);
localStorage.setItem("userId", String(normalizedUser.id));


      // Apply theme globally immediately
      if (normalizedUser.themeMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      /* =========================
         NAVIGATION BY ROLE
      ========================== */
      alert("Login successful");

      const roleRoutes = {
        admin: "/dashboard",
        instructor: "/instructor",
        student: "/student",
      };

      navigate(roleRoutes[normalizedUser.role] || "/");

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
      <div className="relative z-10 w-[360px] rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl p-8 text-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1 opacity-80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md bg-white/25 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm mb-1 opacity-80">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 rounded-md bg-white/25 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password ONLY */}
          <div className="flex justify-end text-sm mb-5">
            <Link
              to="/forgotpassword"
              className="hover:underline opacity-80"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition font-medium shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 opacity-80">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
