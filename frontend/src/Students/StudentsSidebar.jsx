import React from "react";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaClipboardList,
  FaPlayCircle,
  FaPenFancy,
  FaStar,
  FaCog,
  FaCertificate,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../Components/Context/UserContext";

const StudentSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const { logout } = useUser();   // ✅ Use context logout

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/student" },
    { name: "My Courses", icon: <FaBookOpen />, path: "/student/course" },
    { name: "Enroll in Courses", icon: <FaClipboardList />, path: "/student/enroll" },
    { name: "Watch Contents", icon: <FaPlayCircle />, path: "/student/lesson" },
    {
      name: "Take Quizzes / Submit Assignments",
      icon: <FaPenFancy />,
      path: "/student/quiz-view",
    },
    { name: "Course Feedback", icon: <FaStar />, path: "/student/feedback" },
    {
      name: "Download Certificates",
      icon: <FaCertificate />,
      path: "/student/certificate",
    },
    { name: "Settings", icon: <FaCog />, path: "/student/setting" },
  ];

  /* =========================
     SAFE LOGOUT
  ========================== */
  const handleLogout = () => {
    logout(); // ✅ removes only user from storage
    navigate("/", { replace: true });
  };

  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-50 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-md shadow-lg
        border-r border-gray-200 dark:border-gray-700
        flex flex-col overflow-y-auto`}
    >
      {/* LOGO */}
      <div
        className={`flex items-center h-20
          ${collapsed ? "justify-center" : "gap-3 px-4"}`}
      >
        <img
          src="/Assets/logo-bg.png"
          alt="Student"
          className="w-10 h-10 rounded-full shadow-md"
        />
        {!collapsed && (
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Student Panel
          </h1>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 flex flex-col gap-2 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/student"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${collapsed ? "justify-center" : "gap-3"}
                ${
                  isActive
                    ? "bg-[rgba(37,150,190,1)] text-white font-medium"
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

      {/* FOOTER */}
      {!collapsed && (
        <div className="text-center text-xs text-[#043d52] pb-4 dark:text-gray-200">
          © 2025 Student Panel
        </div>
      )}
    </aside>
  );
};

export default StudentSidebar;
