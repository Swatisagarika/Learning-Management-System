import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUserGraduate,
  FaBookOpen,
  FaCalendarAlt,
  FaUmbrellaBeach,
  FaFileInvoiceDollar,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
 
const Sidebar = ({ collapsed }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
 
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };
 
  return (
    <div
      className={`h-screen fixed top-0 left-0 z-50 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-white/70 backdrop-blur-md shadow-lg border-r border-purple-100 px-4 py-6 overflow-y-auto`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <img
          src="/Assets/login-bg.jpg"
          alt="Logo"
          className="w-10 h-10 object-cover rounded-full shadow-md"
        />
        {!collapsed && (
          <h1 className="text-xl font-extrabold tracking-wide text-purple-700">
            LMS
          </h1>
        )}
      </div>
 
      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm font-medium">
        <SidebarItem
          to="/dashboard"
          icon={<FaTachometerAlt />}
          label="Dashboard"
          collapsed={collapsed}
          active={location.pathname === "/dashboard"}
        />
 
        <SidebarDropdown
          label="Instructor"
          icon={<FaUserTie />}
          collapsed={collapsed}
          open={openDropdown === "instructor"}
          toggle={() => toggleDropdown("instructor")}
          links={[
            { to: "/instructorlist", label: "Instructor List" },
            { to: "/addinstructor", label: "Add Instructor" },
          ]}
          location={location}
        />
 
        <SidebarDropdown
          label="Student"
          icon={<FaUserGraduate />}
          collapsed={collapsed}
          open={openDropdown === "student"}
          toggle={() => toggleDropdown("student")}
          links={[
            { to: "/studentlist", label: "Student List" },
          ]}
          location={location}
        />
 
        <SidebarDropdown
          label="Courses"
          icon={<FaBookOpen />}
          collapsed={collapsed}
          open={openDropdown === "courses"}
          toggle={() => toggleDropdown("courses")}
          links={[
            { to: "/allcourses", label: "All Courses" },
            { to: "/coursecategory", label: "Course Categories" },
          ]}
          location={location}
        />
 
        <SidebarItem
          to="/eventmanagement"
          icon={<FaCalendarAlt />}
          label="Event Management"
          collapsed={collapsed}
          active={location.pathname === "/events"}
        />
 
        <SidebarItem
          to="/holiday"
          icon={<FaUmbrellaBeach />}
          label="Holidays"
          collapsed={collapsed}
          active={location.pathname === "/holiday"}
        />
 
        <SidebarDropdown
          label="Fees"
          icon={<FaFileInvoiceDollar />}
          collapsed={collapsed}
          open={openDropdown === "fees"}
          toggle={() => toggleDropdown("fees")}
          links={[
            { to: "/feescollection", label: "Fees Collection" },
          ]}
          location={location}
        />
 
        <SidebarItem
          to="/setting"
          icon={<FaCog />}
          label="Settings"
          collapsed={collapsed}
          active={location.pathname === "/settings"}
        />
 
        <SidebarItem
          to="/"
          icon={<FaSignOutAlt />}
          label="Logout"
          collapsed={collapsed}
        />
      </nav>
    </div>
  );
};
 
// Sidebar Item Component
const SidebarItem = ({ to, icon, label, collapsed, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
      ${active ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-purple-50"}
    `}
  >
    <span className="text-purple-700">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </Link>
);
 
// Sidebar Dropdown
const SidebarDropdown = ({ label, icon, collapsed, open, toggle, links, location }) => (
  <div className="w-full">
    <div
      onClick={toggle}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
        hover:bg-purple-50 ${open ? "bg-purple-50 text-purple-700 font-semibold" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-purple-700">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </div>
      {!collapsed && (
        <span className="text-purple-600">
          {open ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </span>
      )}
    </div>
 
    {open && !collapsed && (
      <div className="ml-8 mt-1 space-y-1 border-l border-purple-200 pl-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-2 py-1 rounded transition-all duration-200
              ${
                location.pathname === link.to
                  ? "bg-purple-100 text-purple-800 font-medium"
                  : "hover:bg-purple-50"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);
 
export default Sidebar;
 