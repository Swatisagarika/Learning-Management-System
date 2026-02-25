import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Pages/Sidebar";
import Topbar from "../Pages/Topbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} />

      {/* MAIN WRAPPER (HEADER + CONTENT MOVE TOGETHER) */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
          ${collapsed ? "ml-20" : "ml-64"}`}
      >
        {/* TOPBAR */}
        <Topbar
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

export default AdminLayout;
