import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaSearch,
  FaChevronDown,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdDashboard, MdSettings, MdLogout } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Components/Context/UserContext";// adjust path if needed

const StudentHeader = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
const { user, updateUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);
  const dateRef = useRef(null);

  /* =============================
     FETCH STUDENT USER
  ============================= */
  useEffect(() => {
  if (!user || user.role !== "student") {
    navigate("/");
  }
}, [user, navigate]);

  /* =============================
     SEARCH
  ============================= */
  const searchData = [
    "Browse Courses",
    "My Enrollments",
    "Lessons",
    "Assignments",
    "Quizzes",
    "Certificates",
    "Reviews",
    "Student Dashboard",
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
     CLOSE POPUPS
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
  updateUser(null);   // clears storage + updates all tabs
  navigate("/");
};


  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900
 shadow-md px-5 py-3 sticky top-0 z-50 border-[rgba(37,150,190,1)]">

      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-[rgba(37,150,190,1)] transition"
      >
        <FaBars size={20} />
      </button>

      {/* Search */}
      <div className="relative w-1/3 max-lg:w-1/2 max-sm:w-2/3">
        <div className="flex items-center rounded-full px-3 py-2 bg-gray-100 shadow-inner">
          <FaSearch className="text-[rgba(37,150,190,1)] mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm px-2 w-full"
          />
        </div>

        <AnimatePresence>
          {filteredResults.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bg-white shadow-lg w-full mt-2 rounded-lg z-50 border"
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
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 z-50 border"
              >
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setShowDatePicker(false);
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

            <span className="hidden sm:block font-medium">
              {user?.fullName || "Student"}
            </span>

            <FaChevronDown size={14} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-56 py-2 z-50 border"
              >
                <p className="px-4 pt-2 font-semibold text-[rgba(37,150,190,1)]">
                  {user?.fullName}
                </p>

                <hr />

                <Link to="/student">
                  <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100">
                    <MdDashboard /> Dashboard
                  </button>
                </Link>

                <Link to="/student/setting">
                  <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100">
                    <MdSettings /> Settings
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-red-50"
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

export default StudentHeader;
