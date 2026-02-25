import React from "react";
import {
  FaTachometerAlt,
  FaBook,
  FaUpload,
  FaQuestionCircle,
  FaUsers,
  FaCog,
  FaComments,
  FaCertificate,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../Components/Context/UserContext"; // adjust path if needed

const InstructorSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const { updateUser } = useUser(); // ✅ use context

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/instructor" },
    { name: "Course Creation", icon: <FaBook />, path: "/instructor/course" },
    { name: "Upload Content", icon: <FaUpload />, path: "/instructor/content" },
    { name: "Quiz / Assignment", icon: <FaQuestionCircle />, path: "/instructor/quiz" },
    { name: "Attendance", icon: <FaClipboardList />, path: "/instructor/attendance" },
    { name: "Student Management", icon: <FaUsers />, path: "/instructor/student" },
    { name: "Course Feedback", icon: <FaComments />, path: "/instructor/feedback" },
    { name: "Certificate Approval", icon: <FaCertificate />, path: "/instructor/certificate-approval" },
    
    // ✅ FIXED route
    { name: "Settings", icon: <FaCog />, path: "/instructor/setting" },
  ];

  const handleLogout = () => {
    // ✅ Proper logout
    updateUser(null);      // clears localStorage + context (from UserProvider)
    navigate("/", { replace: true });
  };

  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-50 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-white/70 dark:bg-gray-900/80
        backdrop-blur-md shadow-lg
        border-r border-gray-200 dark:border-gray-700
        px-4 py-6 overflow-y-auto`}
    >
      {/* LOGO */}
      <div
        className={`flex items-center h-20
        ${collapsed ? "justify-center" : "gap-3 px-4"}`}
      >
        <img
          src="/Assets/logo-bg.png"
          alt="Instructor"
          className="w-10 h-10 rounded-full shadow-md"
        />
        {!collapsed && (
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Instructor Panel
          </h1>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2 text-sm font-medium">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/instructor"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
              ${collapsed ? "justify-center" : "gap-3"}
              ${
                isActive
                  ? "bg-[rgba(37,150,190,1)] text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-[rgba(37,150,190,1)] hover:text-white"
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className={`flex items-center rounded-lg px-3 py-3 mx-2 mb-3
        transition-all duration-200 text-[#043d52]
        hover:bg-red-100 hover:text-red-600 dark:text-gray-200
        ${collapsed ? "justify-center" : "gap-3"}`}
      >
        <FaSignOutAlt />
        {!collapsed && <span>Logout</span>}
      </button>

      {!collapsed && (
        <div className="text-center text-xs text-[#043d52] pb-4 dark:text-gray-200">
          © 2025 Instructor Panel
        </div>
      )}
    </aside>
  );
};

export default InstructorSidebar;
