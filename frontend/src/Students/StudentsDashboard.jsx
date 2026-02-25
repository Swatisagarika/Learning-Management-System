import React from "react";
import StudentsCard from "./StudentsCard";

const StudentsDashboard = () => {
  return (
    <div className="p-6">
      {/* Heading */}
      <h1
        className="text-3xl sm:text-4xl font-extrabold text-center mt-10
        bg-gradient-to-r from-[rgba(37,150,190,1)] via-pink-500 to-orange-400
        bg-clip-text text-transparent drop-shadow-lg tracking-wide"
      >
        ✨ Welcome to Student Dashboard ✨
      </h1>

      {/* Dashboard Cards */}
      <div className="mt-12">
        <StudentsCard />
      </div>
    </div>
  );
};

export default StudentsDashboard;
