import React, { useState } from "react";
import Sidebar from "../Pages/Sidebar";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Topbar from "../Pages/Topbar";

 
const Setting = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
 
  const validateForm = () => {
    const newErrors = {};
    if (!fullname.trim()) newErrors.fullname = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const navigate = useNavigate();
 
  const handleSave = () => {
    if (validateForm()) {
      alert("Settings saved successfully!");
      navigate("/dashboard");
    }
  };
 
  return (
    <div className="flex bg-gray-100 min-h-screen dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64">
        <Topbar />
        <main className="p-4 sm:p-6 md:p-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-white mb-6 text-center">
              Settings
            </h2>
 
            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">
                  Fullname
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your username"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
                )}
              </div>
 
              {/* Email */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
 
              {/* Password */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border rounded pr-10 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
 
              {/* Save Button */}
              <div className="text-center">
                <button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
 
export default Setting;