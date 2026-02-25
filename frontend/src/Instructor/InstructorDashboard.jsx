import React from "react";
import InstructorCard from "./InstructorCard";

const InstructorDashboard = () => {
  return (
    <div className="p-6">

      {/* Welcome Heading */}
      <h1
        className="text-3xl sm:text-4xl font-extrabold text-center w-full mt-8
        bg-gradient-to-r from-[rgba(37,150,190,1)] via-cyan-500 to-blue-500
        bg-clip-text text-transparent drop-shadow-lg tracking-wide"
      >
        ✨ Welcome to Instructor Dashboard ✨
      </h1>

      {/* Dashboard Cards */}
      <div className="mt-10">
        <InstructorCard />
      </div>

    </div>
  );
};

export default InstructorDashboard;
