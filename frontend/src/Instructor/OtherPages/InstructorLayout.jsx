import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import InstructorSidebar from "../InstructorSidebar";
import InstructorHeader from "../InstructorHeader";

const InstructorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* SIDEBAR */}
      <InstructorSidebar collapsed={collapsed} />

      {/* MAIN CONTENT */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${collapsed ? "ml-20" : "ml-64"}`}
      >
        {/* HEADER */}
        <InstructorHeader
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
