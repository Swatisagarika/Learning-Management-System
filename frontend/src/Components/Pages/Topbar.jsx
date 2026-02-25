import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaSearch, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import { MdDashboard, MdSettings, MdLogout } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../Context/UserContext";


const Topbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useUser();


  const profileRef = useRef(null);
  const dateRef = useRef(null); ``

  /* =============================
     ROLE ROUTES
  ============================= */
  const roleRoutes = {
    admin: { dashboard: "/dashboard", setting: "/setting" },
    instructor: {
      dashboard: "/instructordashboard",
      setting: "/instructorsetting",
    },
    student: {
      dashboard: "/studentsdashboard",
      setting: "/StudentSetting",
    },
  };

  const dashboardRoute = roleRoutes[user?.role]?.dashboard || "/";
  const settingRoute = roleRoutes[user?.role]?.setting || "/";

  /* =============================
     SEARCH
  ============================= */
  const searchData = [
    "Dashboard",
    "Users",
    "Courses",
    "Analytics",
    "Certificates",
    "Reports",
    "Settings",
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
    } else {
      setFilteredResults(
        searchData.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  /* =============================
     CLOSE DROPDOWNS
  ============================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =============================
     LOGOUT
  ============================= */
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };


  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900
 shadow-md px-5 py-3 sticky top-0 z-40">
      {/* SIDEBAR TOGGLE */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-[rgba(37,150,190,1)] transition"
      >
        <FaBars size={20} />
      </button>

      {/* SEARCH */}
      <div className="relative w-1/3">
        <div className="flex items-center rounded-full px-3 py-2 bg-gray-100">
          <FaSearch className="text-[rgba(37,150,190,1)] mr-2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <AnimatePresence>
          {filteredResults.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bg-white w-full mt-2 rounded-lg shadow-lg z-50"
            >
              {filteredResults.map((item, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-[rgba(37,150,190,1)] cursor-pointer"
                  onClick={() => {
                    setSearchQuery(item);
                    setFilteredResults([]);
                  }}
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">
        {/* DATE */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(37,150,190,1)] text-white rounded-lg"
          >
            <FaCalendarAlt />
            {date.toLocaleDateString()}
          </button>

          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 bg-white p-3 rounded-lg shadow-lg z-50"
              >
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) {
                      setDate(d);
                      setShowDatePicker(false);
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 bg-[rgba(37,150,190,1)] px-3 py-2 rounded-full text-white"
          >
            <img
              src={
                user?.profileImage
                  ? `http://localhost:5000${user.profileImage}`
                  : "https://i.pravatar.cc/150?img=12"
              }
              className="w-8 h-8 rounded-full object-cover"
              alt="Profile"
            />
            <span className="hidden sm:block">
              {user?.fullName || "User"}
            </span>
            <FaChevronDown size={14} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 bg-white w-56 rounded-lg shadow-lg z-50"
              >
                <Link
                  to={dashboardRoute}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <MdDashboard /> Dashboard
                </Link>

                <Link
                  to={settingRoute}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <MdSettings /> Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 w-full hover:bg-red-50"
                >
                  <MdLogout /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
