import React, { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../Context/UserContext";
 
const Topbar = ({ onToggleSidebar }) => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
 
const { user } = useUser();
 
  const navigate = useNavigate();
 
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return alert("Enter a search term.");
    alert(`Searching for: ${search}`);
   
  };
 
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 shadow-md w-full sticky top-0 z-40">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <FaBars className="text-gray-800 dark:text-white" />
        </button>
 
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1"
        >
          <input
            type="text"
            placeholder="Search here.."
            className="bg-transparent outline-none text-sm px-2 w-28 md:w-56 text-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-purple-500" />
          </button>
        </form>
      </div>
 
      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Date Picker */}
        <div className="flex items-center gap-2 border px-3 py-1 rounded bg-white dark:bg-gray-800">
          <FaCalendarAlt className="text-purple-500" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="text-sm text-purple-600 dark:text-white bg-transparent outline-none"
            dateFormat="dd MMMM yyyy"
          />
        </div>
 
        {/* Profile */}
        <div className="relative">
          <div
  onClick={() => setShowProfileMenu(!showProfileMenu)}
  className="flex items-center gap-2 cursor-pointer"
>
  <img
    src={user.photo}
    alt="User"
    className="w-8 h-8 rounded-full object-cover"
  />
  <span className="text-sm font-medium text-gray-800 dark:text-white">
    {user.name || 'John Doe'}
  </span>
</div>
 
 
          {/* Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded w-40 z-50">
              <ul className="text-sm text-gray-700 dark:text-white">
                <li
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                >
                  <FaUser /> Profile
                </li>
                <li
                  onClick={() => {
                    navigate("/setting");
                    setShowProfileMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                >
                  <FaCog /> Settings
                </li>
                <li
                  onClick={() => {
                    navigate("/");
                    setShowProfileMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                >
                  <FaSignOutAlt /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Topbar;