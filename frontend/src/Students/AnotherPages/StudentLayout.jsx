import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../StudentsSidebar";
import StudentsHeader from "../StudentsHeader";


const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* SIDEBAR */}
      <StudentSidebar collapsed={collapsed} />

      {/* MAIN CONTENT */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${collapsed ? "ml-20" : "ml-64"}`}
      >
        {/* HEADER */}
        <StudentsHeader
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

export default StudentLayout;
